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
	private readonly wsEventEmitter: EventEmitter = new EventEmitter();

	private readonly clientUrl: string;
	private readonly wsProviderOptions?: ClientOptions | ClientRequestArgs;

	private webSocketConnection?: WebSocket;

	/* eslint-disable @typescript-eslint/no-explicit-any */
	private readonly requestQueue: Map<JsonRpcId, WSRequestItem<any, any>>;
	/* eslint-disable @typescript-eslint/no-explicit-any */
	private readonly sentQueue: Map<JsonRpcId, WSRequestItem<any, any>>;

	private reconnectAttempts!: number;
	private readonly reconnectOptions: ReconnectOptions;
	private lastDataChunk!: string;

	public constructor(
		clientUrl: string,
		wsProviderOptions?: ClientOptions | ClientRequestArgs,
		reconnectOptions?: ReconnectOptions,
	) {
		super();
		if (!WebSocketProvider.validateProviderUrl(clientUrl))
			throw new InvalidClientError(clientUrl);

		this.clientUrl = clientUrl;
		this.wsProviderOptions = wsProviderOptions;

		const DEFAULT_WS_PROVIDER_OPTIONS = {
			autoReconnect: true,
			delay: 5000,
			maxAttempts: 5,
		};

		this.reconnectOptions = {
			...DEFAULT_WS_PROVIDER_OPTIONS,
			...reconnectOptions,
		};

		this.requestQueue = new Map<JsonRpcId, WSRequestItem>();
		this.sentQueue = new Map<JsonRpcId, WSRequestItem>();

		this.init();
		this.connect();
	}

	private static validateProviderUrl(providerUrl: string): boolean {
		return typeof providerUrl === 'string' ? /^ws(s)?:\/\//i.test(providerUrl) : false;
	}

	public getStatus(): Web3BaseProviderStatus {
		if (this.webSocketConnection === undefined) return 'disconnected';

		switch (this.webSocketConnection.readyState) {
			case this.webSocketConnection.CONNECTING: {
				return 'connecting';
			}
			case this.webSocketConnection.OPEN: {
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
		this.wsEventEmitter.on(type, callback);
	}

	public once<T = JsonRpcResult>(type: string, callback: Web3BaseProviderCallback<T>): void {
		this.wsEventEmitter.once(type, callback);
	}

	public removeListener(type: string, callback: Web3BaseProviderCallback): void {
		this.wsEventEmitter.removeListener(type, callback);
	}

	public connect(): void {
		try {
			this.webSocketConnection = new WebSocket(this.clientUrl, this.wsProviderOptions);

			this.addSocketListeners();
		} catch (e) {
			throw new InvalidConnectionError(this.clientUrl);
		}
	}

	public disconnect(code?: number, reason?: string): void {
		this.removeSocketListeners();
		this.webSocketConnection?.close(code, reason);
	}

	public reset(): void {
		this.sentQueue.clear();
		this.requestQueue.clear();

		this.init();
		this.removeSocketListeners();
		this.addSocketListeners();
	}

	public async request<T = JsonRpcResponse, T2 = unknown[]>(
		request: JsonRpcPayload<T2>,
	): Promise<T> {
		if (this.webSocketConnection === undefined)
			throw new Error('WebSocket connection is undefined');

		if (request.id === undefined) throw new Error('Request Id not defined');

		const { id } = request;

		if (
			this.webSocketConnection.readyState === this.webSocketConnection.CLOSED ||
			this.webSocketConnection.readyState === this.webSocketConnection.CLOSING
		) {
			this.requestQueue.delete(id);

			throw new ConnectionNotOpenError();
		}

		const requestItem = this.requestQueue.get(id);
		if (this.webSocketConnection.readyState === this.webSocketConnection.CONNECTING) {
			if (requestItem === undefined) {
				const defPromise = new DeferredPromise<T>();

				const reqItem: WSRequestItem<T2, T> = {
					payload: request,
					deferredPromise: defPromise,
				};

				this.requestQueue.set(id, reqItem);
				return defPromise.realPromise;
			}

			return requestItem.deferredPromise.realPromise as Promise<T>;
		}

		let promise;

		if (requestItem !== undefined) {
			this.sentQueue.set(id, requestItem);
			this.requestQueue.delete(id);
			promise = requestItem.deferredPromise.realPromise as Promise<T>;
		} else {
			const defPromise = new DeferredPromise<T>();

			const reqItem: WSRequestItem<T2, T> = {
				payload: request,
				deferredPromise: defPromise,
			};

			this.sentQueue.set(id, reqItem);
			promise = defPromise.realPromise;
		}

		try {
			this.webSocketConnection.send(JSON.stringify(request));
		} catch (error) {
			this.sentQueue.delete(id);
			throw error;
		}

		return promise;
	}

	public removeAllListeners(type: string): void {
		this.wsEventEmitter.removeAllListeners(type);
	}

	private init() {
		this.lastDataChunk = '';
		this.reconnectAttempts = 0;
	}

	private addSocketListeners(): void {
		this.webSocketConnection?.addEventListener('message', this.onMessage.bind(this));
		this.webSocketConnection?.addEventListener('open', this.onConnect.bind(this));
		this.webSocketConnection?.addEventListener('close', this.onClose.bind(this));
	}

	private reconnect(): void {
		if (this.sentQueue.size > 0) {
			this.sentQueue.forEach((request: WSRequestItem, key: JsonRpcId) => {
				request.deferredPromise.reject(new PendingRequestsOnReconnectingError());
				this.sentQueue.delete(key);
			});
		}

		if (this.reconnectAttempts < this.reconnectOptions.maxAttempts) {
			setTimeout(() => {
				this.reconnectAttempts += 1;
				this.removeSocketListeners();
				this.connect();
			}, this.reconnectOptions.delay);
		}
	}

	private onMessage(e: MessageEvent): void {
		this.parseResponse(typeof e.data === 'string' ? e.data : '').forEach(
			(response: JsonRpcResponse | SubscriptionResultNotification) => {
				if ('method' in response && response.method.endsWith('_subscription')) {
					this.wsEventEmitter.emit('message', null, response);
					return;
				}

				const { id } = response;

				if (id && this.sentQueue.has(id)) {
					const requestItem = this.sentQueue.get(id);
					if ('result' in response && response.result !== undefined) {
						this.wsEventEmitter.emit('message', null, response);
						requestItem?.deferredPromise.resolve(response);
					} else if ('error' in response && response.error !== undefined) {
						this.wsEventEmitter.emit('message', response, null);
						requestItem?.deferredPromise.reject(response);
					}

					this.sentQueue.delete(id);
				}
			},
		);
	}

	private onConnect() {
		this.reconnectAttempts = 0;

		if (this.requestQueue.size > 0) {
			for (const value of this.requestQueue.values()) {
				// eslint-disable-next-line
				this.request(value.payload);
			}
		}
	}

	private onClose(event: CloseEvent): void {
		if (
			this.reconnectOptions.autoReconnect &&
			(![1000, 1001].includes(event.code) || !event.wasClean)
		) {
			this.reconnect();
			return;
		}

		if (this.requestQueue.size > 0) {
			this.requestQueue.forEach((request: WSRequestItem, key: JsonRpcId) => {
				request.deferredPromise.reject(new ConnectionNotOpenError(event));
				this.requestQueue.delete(key);
			});
		}

		if (this.sentQueue.size > 0) {
			this.sentQueue.forEach((request: WSRequestItem, key: JsonRpcId) => {
				request.deferredPromise.reject(new ConnectionNotOpenError(event));
				this.sentQueue.delete(key);
			});
		}

		this.removeSocketListeners();
	}

	private parseResponse(dataReceived: string): JsonRpcResponse[] {
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

			if (this.lastDataChunk !== '') dataToParse = this.lastDataChunk + dataToParse;

			let result: JsonRpcResponse;

			try {
				// eslint-disable-next-line
				result = JSON.parse(dataToParse);
			} catch (error) {
				this.lastDataChunk = dataToParse;
				return;
			}

			this.lastDataChunk = '';

			if (result) returnValues.push(result);
		});

		return returnValues;
	}

	private removeSocketListeners(): void {
		this.webSocketConnection?.removeEventListener('message', this.onMessage.bind(this));
		this.webSocketConnection?.removeEventListener('open', this.onConnect.bind(this));
		this.webSocketConnection?.removeEventListener('close', this.onClose.bind(this));
	}
}
