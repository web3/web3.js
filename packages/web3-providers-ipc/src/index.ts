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
	DeferredPromise,
	EthExecutionAPI,
	JsonRpcId,
	JsonRpcNotification,
	JsonRpcResponse,
	JsonRpcResponseWithError,
	JsonRpcResponseWithResult,
	JsonRpcResult,
	Web3APIMethod,
	Web3APIPayload,
	Web3APIReturnType,
	Web3APISpec,
	Web3BaseProvider,
	Web3BaseProviderCallback,
	Web3BaseProviderStatus,
} from 'web3-common';
import { ConnectionNotOpenError, InvalidClientError, InvalidConnectionError } from 'web3-errors';
import { isNullish } from 'web3-utils';

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
	private waitOptions: WaitOptions;
	private _connectionStatus: Web3BaseProviderStatus;

	private readonly _requestQueue: Map<JsonRpcId, DeferredPromise<unknown>>;

	public constructor(socketPath: string) {
		super();

		this._connectionStatus = 'disconnected';
		this._socketPath = socketPath;
		this._socket = new Socket();

		this._requestQueue = new Map<JsonRpcId, DeferredPromise<unknown>>();

		this.connect();
		this.waitOptions = {
			timeOutTime: 5000,
			maxNumberOfAttempts: 10,
		};
	}

	public getStatus(): Web3BaseProviderStatus {
		return this._connectionStatus;
	}

	/* eslint-disable class-methods-use-this */
	public supportsSubscriptions(): boolean {
		return true;
	}

	public on<T = JsonRpcResult>(
		type: 'message' | 'connect' | 'disconnect' | string,
		callback: Web3BaseProviderCallback<T>,
	): void {
		this._emitter.on(type, callback);
	}

	public once<T = JsonRpcResult>(type: string, callback: Web3BaseProviderCallback<T>): void {
		this._emitter.once(type, callback);
	}

	public removeListener(type: string, callback: Web3BaseProviderCallback): void {
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
		ResponseType = Web3APIReturnType<API, Method>,
	>(request: Web3APIPayload<API, Method>): Promise<JsonRpcResponse<ResponseType>> {
		if (isNullish(this._socket)) throw new Error('IPC connection is undefined');

		if (isNullish(request.id)) throw new Error('Request Id not defined');

		if (this.getStatus() !== 'connected') {
			await this.waitForConnection();
		}

		try {
			const defPromise = new DeferredPromise<JsonRpcResponse<ResponseType>>();
			this._requestQueue.set(request.id, defPromise);
			this._socket.write(JSON.stringify(request));

			return defPromise;
		} catch (error) {
			this._requestQueue.delete(request.id);
			throw error;
		}
	}

	public removeAllListeners(type: string): void {
		this._emitter.removeAllListeners(type);
	}

	private _onMessage(e: Buffer | string): void {
		const result = typeof e === 'string' ? e : e.toString('utf8');
		const response = JSON.parse(result) as
			| JsonRpcResponseWithError
			| JsonRpcResponseWithResult
			| JsonRpcNotification;

		if ('method' in response && response.method.endsWith('_subscription')) {
			this._emitter.emit('message', undefined, response);
			return;
		}

		if (response.id && this._requestQueue.has(response.id)) {
			const requestItem = this._requestQueue.get(response.id);

			if ('result' in response && !isNullish(response.result)) {
				this._emitter.emit('message', undefined, response);
				requestItem?.resolve(response);
			} else if ('error' in response && !isNullish(response.error)) {
				this._emitter.emit('message', response, undefined);
				requestItem?.reject(response);
			}

			this._requestQueue.delete(response.id);
		}
	}

	private _clearQueues(event?: CloseEvent) {
		if (this._requestQueue.size > 0) {
			this._requestQueue.forEach((request: DeferredPromise<unknown>, key: JsonRpcId) => {
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
