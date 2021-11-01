import { EventEmitter } from 'events';
import {
	Web3BaseProvider,
	Web3BaseProviderStatus,
	JsonRpcId,
	JsonRpcPayload,
	JsonRpcResponse,
	JsonRpcResult,
	Web3BaseProviderCallback,
	ConnectionEvent,
	SubscriptionResultNotification,
} from 'web3-common';
import { IMessageEvent, w3cwebsocket as W3WS } from 'websocket';
import {
	InvalidConnectionError,
	ConnectionTimeoutError,
	PendingRequestsOnReconnectingError,
	ConnectionNotOpenError,
	InvalidClientError,
} from 'web3-common/dist/errors';
import { WebSocketOptions, WSRequestItem } from './types';
import { DeferredPromise } from './deferredPromise';

export default class WebSocketProvider extends Web3BaseProvider {
	private readonly wsEventEmitter: EventEmitter = new EventEmitter();

	private readonly clientUrl: string;
	private readonly wsProviderOptions: WebSocketOptions;

	private webSocketConnection?: W3WS;

	/* eslint-disable @typescript-eslint/no-explicit-any */
	private readonly requestQueue: Map<JsonRpcId, WSRequestItem<any, any>>;
	/* eslint-disable @typescript-eslint/no-explicit-any */
	private readonly sentQueue: Map<JsonRpcId, WSRequestItem<any, any>>;

	private providerStatus: Web3BaseProviderStatus;

	private reconnectAttempts!: number;
	private lastDataChunk!: string;
	private lastChunkTimeout!: NodeJS.Timeout;

	public constructor(clientUrl: string, wsProviderOptions?: WebSocketOptions) {
		super();
		if (!WebSocketProvider.validateProviderUrl(clientUrl))
			throw new InvalidClientError(clientUrl);

		this.clientUrl = clientUrl;
		if (wsProviderOptions !== undefined) this.wsProviderOptions = wsProviderOptions;
		else
			this.wsProviderOptions = {
				customTimeout: 1000 * 15,
			};

		if (!this.wsProviderOptions.customTimeout) this.wsProviderOptions.customTimeout = 1000 * 15;

		if (!this.wsProviderOptions.reconnectOptions)
			this.wsProviderOptions.reconnectOptions = {
				auto: false,
				delay: 5000,
				maxAttempts: 5,
				onTimeout: false,
			};

		this.requestQueue = new Map<JsonRpcId, WSRequestItem>();
		this.sentQueue = new Map<JsonRpcId, WSRequestItem>();

		this.providerStatus = 'disconnected';

		this.init();
		this.connect();
	}

	private static validateProviderUrl(providerUrl: string): boolean {
		return typeof providerUrl === 'string' ? /^ws(s)?:\/\//i.test(providerUrl) : false;
	}

	public getStatus(): Web3BaseProviderStatus {
		return this.providerStatus;
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
			this.providerStatus = 'connecting';

			this.webSocketConnection = new W3WS(
				this.clientUrl,
				this.wsProviderOptions?.protocol,
				undefined,
				this.wsProviderOptions?.headers,
				this.wsProviderOptions?.requestOptions,
				this.wsProviderOptions?.clientConfig,
			);

			this.addSocketListeners();
		} catch (e) {
			this.providerStatus = 'disconnected';
			throw new InvalidConnectionError(this.clientUrl);
		}
	}

	public disconnect(code: number, reason: string): void {
		this.removeSocketListeners();
		this.webSocketConnection?.close(code || 1000, reason);
		this.providerStatus = 'disconnected';
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

		if (this.requestQueue.has(request.id) || this.sentQueue.has(request.id))
			throw new Error(
				'Duplicate request Id. Another request is already in Queue with same request Id.',
			);

		const { id } = request;

		if (
			this.webSocketConnection.readyState === this.webSocketConnection.CLOSED ||
			this.webSocketConnection.readyState === this.webSocketConnection.CLOSING
		) {
			this.providerStatus = 'disconnected';

			this.requestQueue.delete(id);

			throw new ConnectionNotOpenError();
		}

		const requestItem = this.requestQueue.get(id);
		if (this.webSocketConnection.readyState === this.webSocketConnection.CONNECTING) {
			this.providerStatus = 'connecting';

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

		if (this.lastChunkTimeout) {
			clearTimeout(this.lastChunkTimeout);
		}
	}

	private addSocketListeners(): void {
		// eslint-disable-next-line
		(this.webSocketConnection as any).addEventListener('message', this.onMessage.bind(this));
		// eslint-disable-next-line
		(this.webSocketConnection as any).addEventListener('open', this.onConnect.bind(this));
		// eslint-disable-next-line
		(this.webSocketConnection as any).addEventListener('close', this.onClose.bind(this));
	}

	private reconnect(): void {
		this.providerStatus = 'connecting';

		if (this.sentQueue.size > 0) {
			this.sentQueue.forEach((request: WSRequestItem, key: JsonRpcId) => {
				request.deferredPromise.reject(new PendingRequestsOnReconnectingError());
				this.sentQueue.delete(key);
			});
		}

		if (
			!this.wsProviderOptions?.reconnectOptions?.maxAttempts ||
			this.reconnectAttempts < this.wsProviderOptions.reconnectOptions.maxAttempts
		) {
			setTimeout(() => {
				this.reconnectAttempts += 1;

				this.removeSocketListeners();
				this.connect();
			}, this.wsProviderOptions?.reconnectOptions?.delay);
		}
	}

	private onMessage(e: IMessageEvent): void {
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
		this.providerStatus = 'connected';
		this.reconnectAttempts = 0;

		if (this.requestQueue.size > 0) {
			for (const value of this.requestQueue.values()) {
				// eslint-disable-next-line
				this.request(value.payload);
			}
		}
	}

	private onClose(event: ConnectionEvent): void {
		this.providerStatus = 'disconnected';
		if (
			this.wsProviderOptions?.reconnectOptions?.auto &&
			(![1000, 1001].includes(event.code) || event.wasClean === false)
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

				if (this.lastChunkTimeout) clearTimeout(this.lastChunkTimeout);

				this.lastChunkTimeout = setTimeout(() => {
					if (
						this.wsProviderOptions.reconnectOptions?.auto &&
						this.wsProviderOptions.reconnectOptions?.onTimeout
					) {
						this.reconnect();
						return;
					}

					if (this.requestQueue.size > 0) {
						this.requestQueue.forEach((request: WSRequestItem, key: JsonRpcId) => {
							request.deferredPromise.reject(
								new ConnectionTimeoutError(this.wsProviderOptions.customTimeout),
							);
							this.requestQueue.delete(key);
						});
					}
				}, this.wsProviderOptions.customTimeout);

				return;
			}

			clearTimeout(this.lastChunkTimeout);
			this.lastDataChunk = '';

			if (result) returnValues.push(result);
		});

		return returnValues;
	}

	private removeSocketListeners(): void {
		// eslint-disable-next-line
		(this.webSocketConnection as any).removeEventListener('message', this.onMessage);

		// eslint-disable-next-line
		(this.webSocketConnection as any).removeEventListener('open', this.onConnect);

		// eslint-disable-next-line
		(this.webSocketConnection as any).removeEventListener('close', this.onClose);
	}
}
