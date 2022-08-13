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
import { existsSync } from 'fs';
import { Socket } from 'net';
import {
	EthExecutionAPI,
	JsonRpcId,
	JsonRpcNotification,
	JsonRpcResponseWithResult,
	JsonRpcResult,
	Web3APIMethod,
	Web3APIPayload,
	Web3APIReturnType,
	Web3APISpec,
	Web3BaseProvider,
	Web3ProviderEventCallback,
	Web3ProviderStatus,
} from 'web3-types';
import {
	ConnectionNotOpenError,
	InvalidClientError,
	InvalidConnectionError,
	ResponseError,
} from 'web3-errors';
import { isNullish, Web3DeferredPromise, jsonRpc, ChunkResponseParser } from 'web3-utils';

type WaitOptions = {
	timeOutTime: number;
	maxNumberOfAttempts: number;
};
export default class IpcProvider<
	API extends Web3APISpec = EthExecutionAPI,
> extends Web3BaseProvider<API> {
	private readonly _emitter: EventEmitter = new EventEmitter();
	private readonly _socketPath: string;
	private readonly _socket: Socket;
	private readonly chunkResponseParser: ChunkResponseParser;
	private waitOptions: WaitOptions;
	private _connectionStatus: Web3ProviderStatus;

	private readonly _requestQueue: Map<JsonRpcId, Web3DeferredPromise<unknown>>;

	public constructor(socketPath: string) {
		super();

		this._connectionStatus = 'disconnected';
		this._socketPath = socketPath;
		this._socket = new Socket();

		this._requestQueue = new Map<JsonRpcId, Web3DeferredPromise<unknown>>();

		this.connect();
		this.waitOptions = {
			timeOutTime: 5000,
			maxNumberOfAttempts: 10,
		};
		this.chunkResponseParser = new ChunkResponseParser();
		this.chunkResponseParser.onError(() => {
			this._clearQueues();
		});
	}

	public getStatus(): Web3ProviderStatus {
		return this._connectionStatus;
	}

	/* eslint-disable class-methods-use-this */
	public supportsSubscriptions(): boolean {
		return true;
	}

	public on<T = JsonRpcResult>(
		type: 'message' | 'connect' | 'disconnect' | string,
		callback: Web3ProviderEventCallback<T>,
	): void {
		this._emitter.on(type, callback);
	}

	public once<T = JsonRpcResult>(type: string, callback: Web3ProviderEventCallback<T>): void {
		this._emitter.once(type, callback);
	}

	public removeListener(type: string, callback: Web3ProviderEventCallback): void {
		this._emitter.removeListener(type, callback);
	}

	public connect(): void {
		if (!existsSync(this._socketPath)) {
			throw new InvalidClientError(this._socketPath);
		}

		try {
			this._addSocketListeners();
			this._socket.connect({ path: this._socketPath });
		} catch (e) {
			throw new InvalidConnectionError(this._socketPath);
		}
	}

	public disconnect(): void {
		this._requestQueue.clear();
		this._removeSocketListeners();
		this._socket.end();
	}

	public reset(): void {
		this._requestQueue.clear();

		this._removeSocketListeners();
		this._addSocketListeners();
	}

	public get waitTimeOut(): number {
		return this.waitOptions.timeOutTime;
	}

	public set waitTimeOut(timeOut: number) {
		this.waitOptions.timeOutTime = timeOut;
	}

	public get waitMaxNumberOfAttempts(): number {
		return this.waitOptions.maxNumberOfAttempts;
	}

	public set waitMaxNumberOfAttempts(maxNumberOfAttempts: number) {
		this.waitOptions.maxNumberOfAttempts = maxNumberOfAttempts;
	}

	public async waitForConnection(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			let currentAttempt = 0;
			const interval = setInterval(() => {
				if (currentAttempt > this.waitMaxNumberOfAttempts - 1) {
					clearInterval(interval);
					reject(new ConnectionNotOpenError());
				} else if (this.getStatus() === 'connected') {
					clearInterval(interval);
					resolve();
				}
				currentAttempt += 1;
			}, this.waitTimeOut / this.waitMaxNumberOfAttempts);
		});
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async request<
		Method extends Web3APIMethod<API>,
		ResultType = Web3APIReturnType<API, Method>,
	>(request: Web3APIPayload<API, Method>): Promise<JsonRpcResponseWithResult<ResultType>> {
		if (isNullish(this._socket)) throw new Error('IPC connection is undefined');

		const requestId = jsonRpc.isBatchRequest(request) ? request[0].id : request.id;

		if (isNullish(requestId)) throw new Error('Request Id not defined');

		if (this.getStatus() !== 'connected') {
			await this.waitForConnection();
		}

		try {
			const defPromise = new Web3DeferredPromise<JsonRpcResponseWithResult<ResultType>>();
			this._requestQueue.set(requestId, defPromise);
			this._socket.write(JSON.stringify(request));

			return defPromise;
		} catch (error) {
			this._requestQueue.delete(requestId);
			throw error;
		}
	}

	public removeAllListeners(type: string): void {
		this._emitter.removeAllListeners(type);
	}

	private _onMessage(e: Buffer | string): void {
		const responses = this.chunkResponseParser.parseResponse(
			typeof e === 'string' ? e : e.toString('utf8'),
		);
		if (!responses) {
			return;
		}
		for (const response of responses) {
			if (
				jsonRpc.isResponseWithNotification(response as JsonRpcNotification) &&
				(response as JsonRpcNotification).method.endsWith('_subscription')
			) {
				this._emitter.emit('message', undefined, response);
				return;
			}

			const requestId = jsonRpc.isBatchResponse(response) ? response[0].id : response.id;
			const requestItem = this._requestQueue.get(requestId);

			if (!requestItem) {
				return;
			}

			if (jsonRpc.isBatchResponse(response) || jsonRpc.isResponseWithResult(response)) {
				this._emitter.emit('message', undefined, response);
				requestItem.resolve(response);
			} else {
				this._emitter.emit('message', response, undefined);
				requestItem?.reject(new ResponseError(response));
			}

			this._requestQueue.delete(requestId);
		}
	}

	private _clearQueues(event?: CloseEvent) {
		if (this._requestQueue.size > 0) {
			this._requestQueue.forEach((request: Web3DeferredPromise<unknown>, key: JsonRpcId) => {
				request.reject(new ConnectionNotOpenError(event));
				this._requestQueue.delete(key);
			});
		}

		this._removeSocketListeners();
	}

	private _onConnect() {
		this._connectionStatus = 'connected';
		this._emitter.emit('connect');
	}

	private _onDisconnect(): void {
		this._connectionStatus = 'disconnected';
		this._emitter.emit('disconnect');
	}

	private _onClose(event: CloseEvent): void {
		this._clearQueues(event);
		this._removeSocketListeners();
	}

	private _addSocketListeners(): void {
		this._socket.on('connect', this._onConnect.bind(this));
		this._socket.on('end', this._onDisconnect.bind(this));
		this._socket.on('close', this._onClose.bind(this));
		this._socket.on('data', this._onMessage.bind(this));
	}

	private _removeSocketListeners(): void {
		this._socket?.removeAllListeners('connect');
		this._socket?.removeAllListeners('end');
		this._socket?.removeAllListeners('close');
		this._socket?.removeAllListeners('data');
	}
}
