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

import { Socket } from 'net';
import { InvalidConnectionError, ConnectionNotOpenError, InvalidClientError } from 'web3-errors';
import { SocketProvider } from 'web3-utils';
import {
	EthExecutionAPI,
	JsonRpcId,
	SocketRequestItem,
	Web3APIMethod,
	Web3APIPayload,
	Web3APISpec,
	Web3ProviderStatus,
} from 'web3-types';
import { existsSync } from 'fs';

// todo had to ignore, introduce error in doc generation,see why/better solution
/** @ignore */

export default class IpcProvider<API extends Web3APISpec = EthExecutionAPI> extends SocketProvider<
	Buffer | string,
	CloseEvent,
	Error,
	API
> {
	private _connectionStatus: Web3ProviderStatus;
	// Message handlers. Due to bounding of `this` and removing the listeners we have to keep it's reference.
	protected _socketConnection?: Socket;
	public constructor(socketPath: string) {
		super(socketPath);
		this._connectionStatus = 'connecting';
	}

	public getStatus(): Web3ProviderStatus {
		if (this._socketConnection?.connecting) {
			return 'connecting';
		}
		return this._connectionStatus;
	}
	public connect(): void {
		if (!existsSync(this._socketPath)) {
			throw new InvalidClientError(this._socketPath);
		}
		if (!this._socketConnection || this.getStatus() === 'disconnected') {
			this._socketConnection = new Socket();
		}
		try {
			this._connectionStatus = 'connecting';
			this._addSocketListeners();
			this._socketConnection.connect({ path: this._socketPath });
		} catch (e) {
			throw new InvalidConnectionError(this._socketPath);
		}
	}

	protected _closeSocketConnection(code?: number, data?: string) {
		this._socketConnection?.end(() => {
			this._onDisconnect(code, data);
		});
	}

	protected _sendToSocket<Method extends Web3APIMethod<API>>(
		payload: Web3APIPayload<API, Method>,
	): void {
		if (this.getStatus() === 'disconnected') {
			throw new ConnectionNotOpenError();
		}
		this._socketConnection?.write(JSON.stringify(payload));
	}

	protected _onCloseEvent(event: CloseEvent): void {
		if (
			this._reconnectOptions.autoReconnect &&
			(![1000, 1001].includes(event.code) || !event.wasClean)
		) {
			this._reconnect();
			return;
		}

		this._clearQueues(event);
		this._removeSocketListeners();
		this._onDisconnect(event.code, event.reason);
	}

	protected _parseResponses(e: Buffer | string) {
		return this.chunkResponseParser.parseResponse(
			typeof e === 'string' ? e : e.toString('utf8'),
		);
	}

	protected _onClose(event: CloseEvent): void {
		this._clearQueues(event);
		this._removeSocketListeners();
	}

	protected _addSocketListeners(): void {
		this._socketConnection?.on('data', this._onMessageHandler);
		this._socketConnection?.on('connect', this._onOpenHandler);
		this._socketConnection?.on('close', this._onClose.bind(this));
		this._socketConnection?.on('end', this._onCloseHandler);
		let errorListeners: unknown[] | undefined;
		try {
			errorListeners = (this._socketConnection as Socket)?.listeners('error');
		} catch (error) {
			// At some cases (at GitHub pipeline) there is an error raised when trying to access the listeners
			//	However, no need to do take any specific action in this case beside try adding the event listener for `error`
			this._socketConnection?.on('error', this._onErrorHandler);
			return;
		}
		// The error event listener may be already there because we do not remove it like the others
		// 	So we add it only if it was not already added
		if (!errorListeners || errorListeners.length === 0) {
			this._socketConnection?.on('error', this._onErrorHandler);
		}
	}

	protected _removeSocketListeners(): void {
		this._socketConnection?.removeAllListeners('connect');
		this._socketConnection?.removeAllListeners('end');
		this._socketConnection?.removeAllListeners('close');
		this._socketConnection?.removeAllListeners('data');
	}

	protected _clearQueues(event?: CloseEvent) {
		if (this._pendingRequestsQueue.size > 0) {
			this._pendingRequestsQueue.forEach(
				(request: SocketRequestItem<any, any, any>, key: JsonRpcId) => {
					request.deferredPromise.reject(new ConnectionNotOpenError(event));
					this._pendingRequestsQueue.delete(key);
				},
			);
		}

		if (this._sentRequestsQueue.size > 0) {
			this._sentRequestsQueue.forEach(
				(request: SocketRequestItem<any, any, any>, key: JsonRpcId) => {
					request.deferredPromise.reject(new ConnectionNotOpenError(event));
					this._sentRequestsQueue.delete(key);
				},
			);
		}

		this._removeSocketListeners();
	}

	protected _onConnect() {
		this._connectionStatus = 'connected';
		super._onConnect();
	}

	protected _onDisconnect(code?: number, data?: string): void {
		this._connectionStatus = 'disconnected';
		super._onDisconnect(code, data);
	}
}
