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
import WebSocket, { ClientOptions, CloseEvent, MessageEvent } from 'isomorphic-ws';
import {
	EthExecutionAPI,
	JsonRpcId,
	JsonRpcNotification,
	JsonRpcResponse,
	JsonRpcResult,
	Web3APIMethod,
	Web3APIPayload,
	Web3APIReturnType,
	Web3APISpec,
	Web3BaseProvider,
	Web3BaseProviderCallback,
	Web3BaseProviderStatus,
	DeferredPromise,
	jsonRpc,
	ResponseError,
} from 'web3-common';
import {
	InvalidClientError,
	InvalidConnectionError,
	ConnectionNotOpenError,
	PendingRequestsOnReconnectingError,
	Web3WSProviderError,
	RequestAlreadySentError,
} from 'web3-errors';
import { isNullish } from 'web3-utils';
import { EventEmittedCallback, OnCloseEvent, ReconnectOptions, WSRequestItem } from './types';

export default class WebSocketProvider<
	API extends Web3APISpec = EthExecutionAPI,
> extends Web3BaseProvider<API> {
	private readonly _wsEventEmitter: EventEmitter = new EventEmitter();

	private readonly _clientUrl: string;
	private readonly _wsProviderOptions?: ClientOptions | ClientRequestArgs;

	private _webSocketConnection?: WebSocket;

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

		this._init();
		this.connect();
	}

	private static _validateProviderUrl(providerUrl: string): boolean {
		return typeof providerUrl === 'string' ? /^ws(s)?:\/\//i.test(providerUrl) : false;
	}

	public getStatus(): Web3BaseProviderStatus {
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
		callback: Web3BaseProviderCallback<T> | EventEmittedCallback,
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
		ResponseType = Web3APIReturnType<API, Method>,
	>(request: Web3APIPayload<API, Method>): Promise<JsonRpcResponse<ResponseType>> {
		const requestId = jsonRpc.isBatchRequest(request) ? request[0].id : request.id;

		if (!requestId) {
			throw new Web3WSProviderError('Request Id not defined');
		}

		if (this._sentRequestsQueue.has(requestId)) {
			throw new RequestAlreadySentError(requestId);
		}

		const deferredPromise = new DeferredPromise<JsonRpcResponse<ResponseType>>();

		const reqItem: WSRequestItem<API, Method, JsonRpcResponse<ResponseType>> = {
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
		const response = JSON.parse(event.data as string) as unknown as JsonRpcResponse;

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
	}

	private _emitCloseEvent(code?: number, reason?: string): void {
		this._wsEventEmitter.emit('close', undefined, {
			code,
			reason,
		} as OnCloseEvent);
	}
}
