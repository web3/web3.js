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

import { ClientRequestArgs } from 'http';
import WebSocket, { ClientOptions, CloseEvent } from 'isomorphic-ws';
import {
	EthExecutionAPI,
	Web3APIMethod,
	Web3APIPayload,
	Web3APISpec,
	Web3ProviderStatus,
} from 'web3-types';
import { isNullish, SocketProvider } from 'web3-utils';
import { ConnectionNotOpenError } from 'web3-errors';

export { ClientRequestArgs } from 'http';
// todo had to ignore, introduce error in doc generation,see why/better solution
/** @ignore */
export { ClientOptions } from 'isomorphic-ws';

export default class WebSocketProvider<
	API extends Web3APISpec = EthExecutionAPI,
> extends SocketProvider<WebSocket.MessageEvent, WebSocket.CloseEvent, WebSocket.ErrorEvent, API> {
	protected readonly _providerOptions?: ClientOptions | ClientRequestArgs;
	protected _socketConnection?: WebSocket;

	// eslint-disable-next-line class-methods-use-this
	protected _validateProviderPath(providerUrl: string): boolean {
		return typeof providerUrl === 'string' ? /^ws(s)?:\/\//i.test(providerUrl) : false;
	}

	public getStatus(): Web3ProviderStatus {
		if (this._socketConnection && !isNullish(this._socketConnection)) {
			switch (this._socketConnection.readyState) {
				case this._socketConnection.CONNECTING: {
					return 'connecting';
				}
				case this._socketConnection.OPEN: {
					return 'connected';
				}
				default: {
					return 'disconnected';
				}
			}
		}
		return 'disconnected';
	}
	protected _openSocketConnection() {
		this._socketConnection = new WebSocket(
			this._socketPath,
			undefined,
			this._providerOptions && Object.keys(this._providerOptions).length === 0
				? undefined
				: this._providerOptions,
		);
	}

	protected _closeSocketConnection(code?: number, data?: string) {
		this._socketConnection?.close(code, data);
	}

	protected _sendToSocket<Method extends Web3APIMethod<API>>(
		payload: Web3APIPayload<API, Method>,
	): void {
		if (this.getStatus() === 'disconnected') {
			throw new ConnectionNotOpenError();
		}
		this._socketConnection?.send(JSON.stringify(payload));
	}

	protected _parseResponses(event: WebSocket.MessageEvent) {
		return this.chunkResponseParser.parseResponse(event.data as string);
	}

	protected _addSocketListeners(): void {
		this._socketConnection?.addEventListener('message', this._onMessageHandler);
		this._socketConnection?.addEventListener('open', this._onOpenHandler);
		this._socketConnection?.addEventListener('close', e => this._onCloseHandler(e));
		let errorListeners: unknown[] | undefined;
		try {
			errorListeners = this._socketConnection?.listeners('error');
		} catch (error) {
			// At some cases (at GitHub pipeline) there is an error raised when trying to access the listeners
			//	However, no need to do take any specific action in this case beside try adding the event listener for `error`
			this._socketConnection?.addEventListener('error', this._onErrorHandler);
			return;
		}
		// The error event listener may be already there because we do not remove it like the others
		// 	So we add it only if it was not already added
		if (!errorListeners || errorListeners.length === 0) {
			this._socketConnection?.addEventListener('error', this._onErrorHandler);
		}
	}

	protected _removeSocketListeners(): void {
		this._socketConnection?.removeEventListener('message', this._onMessageHandler);
		this._socketConnection?.removeEventListener('open', this._onOpenHandler);
		this._socketConnection?.removeEventListener('close', this._onCloseHandler);
		// note: we intentionally keep the error event listener to be able to emit it in case an error happens when closing the connection
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
}
