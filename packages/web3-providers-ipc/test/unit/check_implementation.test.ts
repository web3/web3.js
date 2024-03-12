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
import * as fs from 'fs';
import net from 'net';
import { IpcProvider } from '../../src/index';

jest.mock('net');
jest.mock('fs');

describe('IPCProvider', () => {
	let socketPath: string;

	beforeEach(() => {
		socketPath = '/test/test.ipc';
		jest.spyOn(fs, 'existsSync').mockReturnValue(true);
		jest.spyOn(net.Socket.prototype, 'connect').mockImplementation(jest.fn());
		jest.spyOn(net.Socket.prototype, 'write').mockImplementation(jest.fn());
	});

	describe('methods', () => {
		it.each(['_openSocketConnection', '_addSocketListeners'])(
			'should call method %s',
			method => {
				const _method = jest.fn();
				// @ts-expect-error mock method
				jest.spyOn(IpcProvider.prototype, method).mockImplementation(_method);
				const ipc = new IpcProvider(socketPath);
				expect(ipc).toBeDefined();
				expect(_method).toHaveBeenCalled();
			},
		);
		it('should construct with expected methods', () => {
			const _closeSocketConnection = jest.fn();
			const _removeSocketListeners = jest.fn();
			const _onDisconnect = jest.fn();

			const code = 1002;
			const data = 'data';
			// @ts-expect-error mock method
			jest.spyOn(IpcProvider.prototype, '_closeSocketConnection').mockImplementation(
				_closeSocketConnection,
			);
			// @ts-expect-error mock method
			jest.spyOn(IpcProvider.prototype, '_removeSocketListeners').mockImplementation(
				_removeSocketListeners,
			);
			// @ts-expect-error mock method
			jest.spyOn(IpcProvider.prototype, '_onDisconnect').mockImplementation(_onDisconnect);
			const ipc = new IpcProvider(socketPath);
			// @ts-expect-error mock method
			ipc._parseResponses = jest.fn();
			ipc.disconnect(code, data);
			expect(_removeSocketListeners).toHaveBeenCalled();
			expect(_onDisconnect).toHaveBeenCalledWith(code, data);
			expect(_closeSocketConnection).toHaveBeenCalledWith(code, data);
		});
		it('getStatus', () => {
			const ipc = new IpcProvider(socketPath);
			// @ts-expect-error mock field
			ipc._socketConnection.connecting = true;
			expect(ipc.getStatus()).toBe('connecting');
		});
		it('socketConnection.end', () => {
			const ipc = new IpcProvider(socketPath);
			const end = jest.fn((cb: () => void) => {
				cb();
			});
			const _onDisconnect = jest.fn();
			// @ts-expect-error mock method
			ipc._socketConnection.end = end;
			// @ts-expect-error mock method
			ipc._onDisconnect = _onDisconnect;
			const code = 1002;
			const data = 'data';
			// @ts-expect-error mock field
			ipc._socketConnection.connecting = false;
			// @ts-expect-error mock field
			ipc._connectionStatus = 'connected';
			expect(ipc.getStatus()).toBe('connected');
			ipc.disconnect(code, data);

			expect(_onDisconnect).toHaveBeenCalledWith(code, data);
			expect(end).toHaveBeenCalled();
		});

		it('_onCloseHandler autoReconnect=false', () => {
			const ipc = new IpcProvider(socketPath, {}, { autoReconnect: false });
			const _clearQueues = jest.fn();
			const _removeSocketListeners = jest.fn();
			const _onDisconnect = jest.fn();

			// @ts-expect-error mock method
			ipc._clearQueues = _clearQueues;
			// @ts-expect-error mock method
			ipc._removeSocketListeners = _removeSocketListeners;
			// @ts-expect-error mock method
			ipc._onDisconnect = _onDisconnect;
			// @ts-expect-error mock method
			ipc._socketConnection.connecting = false;
			// @ts-expect-error emit method
			ipc._connectionStatus = 'connected';

			// @ts-expect-error emit method
			ipc._onCloseHandler();
			expect(_clearQueues).toHaveBeenCalled();
			expect(_removeSocketListeners).toHaveBeenCalled();
			expect(_onDisconnect).toHaveBeenCalledWith(undefined, undefined);
		});
		it('_onCloseHandler autoReconnect=true', () => {
			const ipc = new IpcProvider(socketPath);
			const _reconnect = jest.fn();
			// @ts-expect-error mock method
			ipc._reconnect = _reconnect;

			// @ts-expect-error emit event
			ipc._onCloseHandler();
			expect(_reconnect).toHaveBeenCalled();
		});
		it('listeners', () => {
			const ipc = new IpcProvider(socketPath, undefined, { autoReconnect: false });
			// @ts-expect-error mock method
			ipc.chunkResponseParser.parseResponse = jest.fn(() => {
				return [];
			});
			// @ts-expect-error mock method
			ipc._socketConnection.listeners = () => {
				throw new Error('error');
			};
			const on = jest.fn((event: string, cb: (data?: string) => void) => {
				if (event === 'error') {
					cb('error');
				} else if (event === 'data') {
					cb('data');
				} else {
					cb();
				}
			});
			// @ts-expect-error mock method
			ipc._socketConnection.on = on;
			// @ts-expect-error mock method
			ipc.isReconnecting = true;
			// @ts-expect-error mock method
			ipc._reconnect = jest.fn();
			// @ts-expect-error mock method
			ipc._clearQueues = jest.fn();
			// @ts-expect-error mock method
			ipc._addSocketListeners();
			// @ts-expect-error mock method
			expect(on).toHaveBeenCalledWith('error', ipc._onErrorHandler);
			const removeAllListeners = jest.fn();
			// @ts-expect-error mock method
			ipc._socketConnection.removeAllListeners = removeAllListeners;
			// @ts-expect-error mock method
			ipc.isReconnecting = false;
			ipc.disconnect();
			expect(removeAllListeners).toHaveBeenCalledWith('end');
			expect(removeAllListeners).toHaveBeenCalledWith('close');
			expect(removeAllListeners).toHaveBeenCalledWith('data');
			expect(removeAllListeners).toHaveBeenCalledWith('connect');
		});
	});
});
