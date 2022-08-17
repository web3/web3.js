/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import { EventEmitter } from 'events';
import { ClientRequestArgs } from 'http';
import WebSocket, { ClientOptions, CloseEvent, ErrorEvent, MessageEvent } from 'isomorphic-ws';
import {
	EthExecutionAPI,
	JsonRpcId,
	JsonRpcNotification,
	JsonRpcResult,
	Web3APIMethod,
	Web3APIPayload,
	Web3APIReturnType,
	Web3APISpec,
	Web3BaseProvider,
	Web3ProviderEventCallback,
	Web3ProviderStatus,
	JsonRpcResponseWithResult,
} from 'web3-types';
import { jsonRpc, isNullish, Web3DeferredPromise, ChunkResponseParser } from 'web3-utils';
import {
	InvalidClientError,
	InvalidConnectionError,
	ConnectionNotOpenError,
	PendingRequestsOnReconnectingError,
	Web3WSProviderError,
	RequestAlreadySentError,
	ResponseError,
} from 'web3-errors';
import { EventEmittedCallback, OnCloseEvent, ReconnectOptions, WSRequestItem } from './types';

export { ClientRequestArgs } from 'http';
// todo had to ignore, introduce error in doc generation,see why/better solution
/** @ignore */
export { ClientOptions } from 'isomorphic-ws';
export { ReconnectOptions } from './types';
export default class WebSocketProvider<
	API extends Web3APISpec = EthExecutionAPI,
> extends Web3BaseProvider<API> {
	private readonly _wsEventEmitter: EventEmitter = new EventEmitter();

	private readonly _clientUrl: string;
	private readonly _wsProviderOptions?: ClientOptions | ClientRequestArgs;

	private _webSocketConnection?: WebSocket;
	private readonly chunkResponseParser: ChunkResponseParser;

	/* eslint-disable @typescript-eslint/no-explicit-any */
	protected readonly _pendingRequestsQueue: Map<JsonRpcId, WSRequestItem<any, any, any>>;
	/* eslint-disable @typescript-eslint/no-explicit-any */
	protected readonly _sentRequestsQueue: Map<JsonRpcId, WSRequestItem<any, any, any>>;

	private _reconnectAttempts!: number;
	private readonly _reconnectOptions: ReconnectOptions;

	// Message handlers. Due to bounding of `this` and removing the listeners we have to keep it's reference.
	private readonly _onMessageHandler: (event: MessageEvent) => void;
	private readonly _onOpenHandler: () => void;
	private readonly _onCloseHandler: (event: CloseEvent) => void;
	private readonly _onErrorHandler: (event: ErrorEvent) => void;

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

		const DEFAULT_PROVIDER_RECONNECTION_OPTIONS = {
			autoReconnect: true,
			delay: 5000,
			maxAttempts: 5,
		};

		this._reconnectOptions = {
			...DEFAULT_PROVIDER_RECONNECTION_OPTIONS,
			...reconnectOptions,
		};

		this._pendingRequestsQueue = new Map<JsonRpcId, WSRequestItem<any, any, any>>();
		this._sentRequestsQueue = new Map<JsonRpcId, WSRequestItem<any, any, any>>();

		this._onMessageHandler = this._onMessage.bind(this);
		this._onOpenHandler = this._onConnect.bind(this);
		this._onCloseHandler = this._onClose.bind(this);
		this._onErrorHandler = this._onError.bind(this);

		this._init();
		this.connect();
		this.chunkResponseParser = new ChunkResponseParser();
		this.chunkResponseParser.onError(() => {
			this._clearQueues();
		});
	}

	private static _validateProviderUrl(providerUrl: string): boolean {
		return typeof providerUrl === 'string' ? /^ws(s)?:\/\//i.test(providerUrl) : false;
	}

	public getStatus(): Web3ProviderStatus {
		if (isNullish(this._webSocketConnection)) return 'disconnected';

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
		callback: Web3ProviderEventCallback<T> | EventEmittedCallback,
	): void {
		this._wsEventEmitter.on(type, callback);
	}

	public once<T = JsonRpcResult>(type: string, callback: Web3ProviderEventCallback<T>): void {
		this._wsEventEmitter.once(type, callback);
	}

	public removeListener(type: string, callback: Web3ProviderEventCallback): void {
		this._wsEventEmitter.removeListener(type, callback);
	}

	public connect(): void {
		try {
			this._webSocketConnection = new WebSocket(
				this._clientUrl,
				undefined,
				this._wsProviderOptions && Object.keys(this._wsProviderOptions).length === 0
					? undefined
					: this._wsProviderOptions,
			);

			this._addSocketListeners();

			// TODO: Debug why this is needed
			// if (this.getStatus() === 'connecting') {
			// 	// Rejecting promises if provider is not connected even after reattempts
			// 	setTimeout(() => {
			// 		if (this.getStatus() === 'disconnected') {
			// 			this._clearQueues(undefined);
			// 		}
			// 	}, this._reconnectOptions.delay * (this._reconnectOptions.maxAttempts + 1));
			// }
		} catch (e) {
			throw new InvalidConnectionError(this._clientUrl);
		}
	}

	public disconnect(code?: number, reason?: string): void {
		this._emitCloseEvent(code, reason);
		this._removeSocketListeners();
		this._webSocketConnection?.close(code, reason);
	}

	public reset(): void {
		this._sentRequestsQueue.clear();
		this._pendingRequestsQueue.clear();

		this._init();
		this._removeSocketListeners();
		this._addSocketListeners();
	}

	public async request<
		Method extends Web3APIMethod<API>,
		ResultType = Web3APIReturnType<API, Method>,
	>(request: Web3APIPayload<API, Method>): Promise<JsonRpcResponseWithResult<ResultType>> {
		const requestId = jsonRpc.isBatchRequest(request) ? request[0].id : request.id;

		if (!requestId) {
			throw new Web3WSProviderError('Request Id not defined');
		}

		if (this._sentRequestsQueue.has(requestId)) {
			throw new RequestAlreadySentError(requestId);
		}

		const deferredPromise = new Web3DeferredPromise<JsonRpcResponseWithResult<ResultType>>();

		const reqItem: WSRequestItem<API, Method, JsonRpcResponseWithResult<ResultType>> = {
			payload: request,
			deferredPromise,
		};

		if (this.getStatus() === 'connecting') {
			this._pendingRequestsQueue.set(requestId, reqItem);

			return reqItem.deferredPromise;
		}

		this._sentRequestsQueue.set(requestId, reqItem);

		try {
			this._sendToSocket(reqItem.payload);
		} catch (error) {
			this._sentRequestsQueue.delete(requestId);
			throw error;
		}

		return deferredPromise;
	}

	private _sendToSocket<Method extends Web3APIMethod<API>>(
		payload: Web3APIPayload<API, Method>,
	): void {
		if (!this._webSocketConnection) {
			throw new Web3WSProviderError('WebSocket connection is not created');
		}

		if (this.getStatus() === 'disconnected') {
			throw new ConnectionNotOpenError();
		}

		this._webSocketConnection.send(JSON.stringify(payload));
	}

	public removeAllListeners(type: string): void {
		this._wsEventEmitter.removeAllListeners(type);
	}

	private _init() {
		this._reconnectAttempts = 0;
	}

	private _addSocketListeners(): void {
		this._webSocketConnection?.addEventListener('message', this._onMessageHandler);
		this._webSocketConnection?.addEventListener('open', this._onOpenHandler);
		this._webSocketConnection?.addEventListener('close', this._onCloseHandler);

		let errorListeners: unknown[] | undefined;
		try {
			errorListeners = this._webSocketConnection?.listeners('error');
		} catch (error) {
			// At some cases (at GitHub pipeline) there is an error raised when trying to access the listeners
			//	However, no need to do take any specific action in this case beside try adding the event listener for `error`
			this._webSocketConnection?.addEventListener('error', this._onErrorHandler);
			return;
		}
		// The error event listener may be already there because we do not remove it like the others
		// 	So we add it only if it was not already added
		if (!errorListeners || errorListeners.length === 0) {
			this._webSocketConnection?.addEventListener('error', this._onErrorHandler);
		}
	}

	private _reconnect(): void {
		if (this._sentRequestsQueue.size > 0) {
			this._sentRequestsQueue.forEach(
				(request: WSRequestItem<any, any, any>, key: JsonRpcId) => {
					request.deferredPromise.reject(new PendingRequestsOnReconnectingError());
					this._sentRequestsQueue.delete(key);
				},
			);
		}

		if (this._reconnectAttempts < this._reconnectOptions.maxAttempts) {
			setTimeout(() => {
				this._reconnectAttempts += 1;
				this._removeSocketListeners();
				this.connect();
			}, this._reconnectOptions.delay);
		}
	}

	private _onMessage(event: MessageEvent): void {
		const responses = this.chunkResponseParser.parseResponse(event.data as string);
		if (!responses) {
			return;
		}
		for (const response of responses) {
			if (
				jsonRpc.isResponseWithNotification(response as JsonRpcNotification) &&
				(response as JsonRpcNotification).method.endsWith('_subscription')
			) {
				this._wsEventEmitter.emit('message', undefined, response);
				return;
			}

			const requestId = jsonRpc.isBatchResponse(response) ? response[0].id : response.id;
			const requestItem = this._sentRequestsQueue.get(requestId);

			if (!requestItem) {
				return;
			}

			if (jsonRpc.isBatchResponse(response) || jsonRpc.isResponseWithResult(response)) {
				this._wsEventEmitter.emit('message', undefined, response);
				requestItem.deferredPromise.resolve(response);
			} else {
				this._wsEventEmitter.emit('message', response, undefined);
				requestItem?.deferredPromise.reject(new ResponseError(response));
			}

			this._sentRequestsQueue.delete(requestId);
		}
	}

	private _onConnect() {
		this._reconnectAttempts = 0;
		this._wsEventEmitter.emit('open');
		this._sendPendingRequests();
	}

	private _sendPendingRequests() {
		for (const [id, value] of this._pendingRequestsQueue.entries()) {
			this._sendToSocket(value.payload as Web3APIPayload<API, any>);
			this._pendingRequestsQueue.delete(id);
			this._sentRequestsQueue.set(id, value);
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

		this._emitCloseEvent(event.code, event.reason);
		this._clearQueues(event);
		this._removeSocketListeners();
	}

	private _onError(event: ErrorEvent): void {
		this._wsEventEmitter.emit('error', event);
	}

	private _clearQueues(event?: CloseEvent) {
		if (this._pendingRequestsQueue.size > 0) {
			this._pendingRequestsQueue.forEach(
				(request: WSRequestItem<any, any, any>, key: JsonRpcId) => {
					request.deferredPromise.reject(new ConnectionNotOpenError(event));
					this._pendingRequestsQueue.delete(key);
				},
			);
		}

		if (this._sentRequestsQueue.size > 0) {
			this._sentRequestsQueue.forEach(
				(request: WSRequestItem<any, any, any>, key: JsonRpcId) => {
					request.deferredPromise.reject(new ConnectionNotOpenError(event));
					this._sentRequestsQueue.delete(key);
				},
			);
		}

		this._removeSocketListeners();
	}

	private _removeSocketListeners(): void {
		this._webSocketConnection?.removeEventListener('message', this._onMessageHandler);
		this._webSocketConnection?.removeEventListener('open', this._onOpenHandler);
		this._webSocketConnection?.removeEventListener('close', this._onCloseHandler);
		// note: we intentionally keep the error event listener to be able to emit it in case an error happens when closing the connection
	}

	private _emitCloseEvent(code?: number, reason?: string): void {
		this._wsEventEmitter.emit('close', undefined, {
			code,
			reason,
		} as OnCloseEvent);
	}
}
