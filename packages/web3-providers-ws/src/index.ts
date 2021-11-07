import { EventEmitter } from 'events';
import {
	Web3BaseProvider,
	Web3BaseProviderStatus,
	JsonRpcId,
	JsonRpcPayload,
	JsonRpcResponse,
	JsonRpcResult,
	Web3BaseProviderCallback,
	SubscriptionResultNotification,
} from 'web3-common';
import { ClientRequestArgs } from 'http';
import { ClientOptions, WebSocket, MessageEvent, CloseEvent } from 'isomorphic-ws';
import {
	InvalidConnectionError,
	PendingRequestsOnReconnectingError,
	ConnectionNotOpenError,
	InvalidClientError,
} from 'web3-common/dist/errors';
import { ReconnectOptions, WSRequestItem } from './types';
import { DeferredPromise } from './deferredPromise';

export default class WebSocketProvider extends Web3BaseProvider {
	private readonly _wsEventEmitter: EventEmitter = new EventEmitter();

	private readonly _clientUrl: string;
	private readonly _wsProviderOptions?: ClientOptions | ClientRequestArgs;

	private _webSocketConnection?: WebSocket;

	/* eslint-disable @typescript-eslint/no-explicit-any */
	private readonly _requestQueue: Map<JsonRpcId, WSRequestItem<any, any>>;
	/* eslint-disable @typescript-eslint/no-explicit-any */
	private readonly _sentQueue: Map<JsonRpcId, WSRequestItem<any, any>>;

	private _reconnectAttempts!: number;
	private readonly _reconnectOptions: ReconnectOptions;
	private _lastDataChunk!: string;

	public constructor(
		clientUrl: string,
		wsProviderOptions?: ClientOptions | ClientRequestArgs,
		reconnectOptions?: ReconnectOptions,
	) {
		super();
		if (!WebSocketProvider._validateProviderUrl(clientUrl))
			throw new InvalidClientError(clientUrl);

		this._clientUrl = clientUrl;
		this._wsProviderOptions = wsProviderOptions;

		const DEFAULT_WS_PROVIDER_OPTIONS = {
			autoReconnect: true,
			delay: 5000,
			maxAttempts: 5,
		};

		this._reconnectOptions = {
			...DEFAULT_WS_PROVIDER_OPTIONS,
			...reconnectOptions,
		};

		this._requestQueue = new Map<JsonRpcId, WSRequestItem>();
		this._sentQueue = new Map<JsonRpcId, WSRequestItem>();

		this._init();
		this.connect();
	}

	private static _validateProviderUrl(providerUrl: string): boolean {
		return typeof providerUrl === 'string' ? /^ws(s)?:\/\//i.test(providerUrl) : false;
	}

	public getStatus(): Web3BaseProviderStatus {
		if (this._webSocketConnection === undefined) return 'disconnected';

		switch (this._webSocketConnection.readyState) {
			case this._webSocketConnection.CONNECTING: {
				return 'connecting';
			}
			case this._webSocketConnection.OPEN: {
				return 'connected';
			}
			default: {
				return 'disconnected';
			}
		}
	}

	/* eslint-disable class-methods-use-this */
	public supportsSubscriptions(): boolean {
		return true;
	}

	public on<T = JsonRpcResult>(
		type: 'message' | string,
		callback: Web3BaseProviderCallback<T>,
	): void {
		this._wsEventEmitter.on(type, callback);
	}

	public once<T = JsonRpcResult>(type: string, callback: Web3BaseProviderCallback<T>): void {
		this._wsEventEmitter.once(type, callback);
	}

	public removeListener(type: string, callback: Web3BaseProviderCallback): void {
		this._wsEventEmitter.removeListener(type, callback);
	}

	public connect(): void {
		try {
			this._webSocketConnection = new WebSocket(this._clientUrl, this._wsProviderOptions);

			this._addSocketListeners();
		} catch (e) {
			throw new InvalidConnectionError(this._clientUrl);
		}
	}

	public disconnect(code?: number, reason?: string): void {
		this._removeSocketListeners();
		this._webSocketConnection?.close(code, reason);
	}

	public reset(): void {
		this._sentQueue.clear();
		this._requestQueue.clear();

		this._init();
		this._removeSocketListeners();
		this._addSocketListeners();
	}

	public async request<T = JsonRpcResponse, T2 = unknown[]>(
		request: JsonRpcPayload<T2>,
	): Promise<T> {
		if (this._webSocketConnection === undefined)
			throw new Error('WebSocket connection is undefined');

		if (request.id === undefined) throw new Error('Request Id not defined');

		const { id } = request;

		if (
			this._webSocketConnection.readyState === this._webSocketConnection.CLOSED ||
			this._webSocketConnection.readyState === this._webSocketConnection.CLOSING
		) {
			this._requestQueue.delete(id);

			throw new ConnectionNotOpenError();
		}

		const requestItem = this._requestQueue.get(id);
		if (this._webSocketConnection.readyState === this._webSocketConnection.CONNECTING) {
			if (requestItem === undefined) {
				const defPromise = new DeferredPromise<T>();

				const reqItem: WSRequestItem<T2, T> = {
					payload: request,
					deferredPromise: defPromise,
				};

				this._requestQueue.set(id, reqItem);
				return defPromise.realPromise;
			}

			return requestItem.deferredPromise.realPromise as Promise<T>;
		}

		let promise;

		if (requestItem !== undefined) {
			this._sentQueue.set(id, requestItem);
			this._requestQueue.delete(id);
			promise = requestItem.deferredPromise.realPromise as Promise<T>;
		} else {
			const defPromise = new DeferredPromise<T>();

			const reqItem: WSRequestItem<T2, T> = {
				payload: request,
				deferredPromise: defPromise,
			};

			this._sentQueue.set(id, reqItem);
			promise = defPromise.realPromise;
		}

		try {
			this._webSocketConnection.send(JSON.stringify(request));
		} catch (error) {
			this._sentQueue.delete(id);
			throw error;
		}

		return promise;
	}

	public removeAllListeners(type: string): void {
		this._wsEventEmitter.removeAllListeners(type);
	}

	private _init() {
		this._lastDataChunk = '';
		this._reconnectAttempts = 0;
	}

	private _addSocketListeners(): void {
		this._webSocketConnection?.addEventListener('message', this._onMessage.bind(this));
		this._webSocketConnection?.addEventListener('open', this._onConnect.bind(this));
		this._webSocketConnection?.addEventListener('close', this._onClose.bind(this));
	}

	private _reconnect(): void {
		if (this._sentQueue.size > 0) {
			this._sentQueue.forEach((request: WSRequestItem, key: JsonRpcId) => {
				request.deferredPromise.reject(new PendingRequestsOnReconnectingError());
				this._sentQueue.delete(key);
			});
		}

		if (this._reconnectAttempts < this._reconnectOptions.maxAttempts) {
			setTimeout(() => {
				this._reconnectAttempts += 1;
				this._removeSocketListeners();
				this.connect();
			}, this._reconnectOptions.delay);
		}
	}

	private _onMessage(e: MessageEvent): void {
		this._parseResponse(typeof e.data === 'string' ? e.data : '').forEach(
			(response: JsonRpcResponse | SubscriptionResultNotification) => {
				if ('method' in response && response.method.endsWith('_subscription')) {
					this._wsEventEmitter.emit('message', null, response);
					return;
				}

				const { id } = response;

				if (id && this._sentQueue.has(id)) {
					const requestItem = this._sentQueue.get(id);
					if ('result' in response && response.result !== undefined) {
						this._wsEventEmitter.emit('message', null, response);
						requestItem?.deferredPromise.resolve(response);
					} else if ('error' in response && response.error !== undefined) {
						this._wsEventEmitter.emit('message', response, null);
						requestItem?.deferredPromise.reject(response);
					}

					this._sentQueue.delete(id);
				}
			},
		);
	}

	private _onConnect() {
		this._reconnectAttempts = 0;

		if (this._requestQueue.size > 0) {
			for (const value of this._requestQueue.values()) {
				// eslint-disable-next-line
				this.request(value.payload);
			}
		}
	}

	private _onClose(event: CloseEvent): void {
		if (
			this._reconnectOptions.autoReconnect &&
			(![1000, 1001].includes(event.code) || !event.wasClean)
		) {
			this._reconnect();
			return;
		}

		if (this._requestQueue.size > 0) {
			this._requestQueue.forEach((request: WSRequestItem, key: JsonRpcId) => {
				request.deferredPromise.reject(new ConnectionNotOpenError(event));
				this._requestQueue.delete(key);
			});
		}

		if (this._sentQueue.size > 0) {
			this._sentQueue.forEach((request: WSRequestItem, key: JsonRpcId) => {
				request.deferredPromise.reject(new ConnectionNotOpenError(event));
				this._sentQueue.delete(key);
			});
		}

		this._removeSocketListeners();
	}

	private _parseResponse(dataReceived: string): JsonRpcResponse[] {
		const returnValues: JsonRpcResponse[] = [];

		// de chunk
		const dechunkedData = dataReceived
			.replace(/\}[\n\r]?\{/g, '}|--|{') // }{
			.replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
			.replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
			.replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
			.split('|--|');

		dechunkedData.forEach((data: string) => {
			let dataToParse: string = data;

			if (this._lastDataChunk !== '') dataToParse = this._lastDataChunk + dataToParse;

			let result: JsonRpcResponse;

			try {
				// eslint-disable-next-line
				result = JSON.parse(dataToParse);
			} catch (error) {
				this._lastDataChunk = dataToParse;
				return;
			}

			this._lastDataChunk = '';

			if (result) returnValues.push(result);
		});

		return returnValues;
	}

	private _removeSocketListeners(): void {
		this._webSocketConnection?.removeEventListener('message', this._onMessage.bind(this));
		this._webSocketConnection?.removeEventListener('open', this._onConnect.bind(this));
		this._webSocketConnection?.removeEventListener('close', this._onClose.bind(this));
	}
}
