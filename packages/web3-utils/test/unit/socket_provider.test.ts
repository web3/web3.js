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

import { Web3APIPayload, EthExecutionAPI, JsonRpcResponse, Web3ProviderStatus } from 'web3-types';
import { SocketProvider } from '../../src/socket_provider';

const dummySocketConnection = { dummy: 'dummy' };

class TestProvider extends SocketProvider<any, any, any> {
	protected _socketConnection?: typeof dummySocketConnection;

	protected _openSocketConnection() {
		this._socketConnection = dummySocketConnection;
	}

	// Dummy implementation of the abstract base methods
	// eslint-disable-next-line
	protected _addSocketListeners(): void {}
	// eslint-disable-next-line
	protected _removeSocketListeners(): void {}
	// eslint-disable-next-line
	protected _onCloseEvent(_event: any): void {}
	// eslint-disable-next-line
	protected _sendToSocket(_payload: Web3APIPayload<EthExecutionAPI, any>): void {}
	// eslint-disable-next-line
	protected _parseResponses(_event: any): JsonRpcResponse[] {
		return [] as JsonRpcResponse[];
	}
	public message(_event: any): void {
		this._onMessage(_event);
	}

	// eslint-disable-next-line
	protected _closeSocketConnection(
		_code?: number | undefined,
		_data?: string | undefined,
		// eslint-disable-next-line
	): void {}
	// eslint-disable-next-line
	getStatus(): Web3ProviderStatus {
		return 'connected';
	}
}

describe('SocketProvider', () => {
	const socketPath = `some_path`;
	const socketOption = { dummyOption: true } as const;

	describe('constructor', () => {
		it('should construct the instance of the provider', () => {
			const provider = new TestProvider(socketPath, socketOption);
			expect(provider).toBeInstanceOf(SocketProvider);
			expect(provider.SocketConnection).toEqual(dummySocketConnection);
		});
	});
	describe('socket_provider unit tests', () => {
		it('should not call method reconnect', () => {
			const reconnectOptions = { autoReconnect: false };
			const provider = new TestProvider(socketPath, socketOption, reconnectOptions);
			// @ts-expect-error run protected method
			jest.spyOn(provider, '_reconnect').mockReturnValue('');
			provider.message('');
			// @ts-expect-error run protected method
			expect(provider._reconnect).not.toHaveBeenCalled();
		});
		it('should call method reconnect', () => {
			const reconnectOptions = { autoReconnect: true };
			const provider = new TestProvider(socketPath, socketOption, reconnectOptions);
			// @ts-expect-error run protected method
			jest.spyOn(provider, '_reconnect').mockReturnValue('');
			provider.message('');
			// @ts-expect-error run protected method
			expect(provider._reconnect).toHaveBeenCalled();
		});
	});
});
