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
import WebSocket from 'isomorphic-ws';
import WebSocketProvider from '../../src/index';

jest.mock('isomorphic-ws');
describe('WebSocketProvider', () => {
	let send: () => void;
	beforeAll(() => {
		send = jest.fn();
		jest.spyOn(WebSocket.prototype, 'send').mockImplementation(send);
	});

	describe('methods', () => {
		it.each(['_openSocketConnection', '_addSocketListeners'])(
			'should call method %s',
			method => {
				const _method = jest.fn();
				// @ts-expect-error mock method
				jest.spyOn(WebSocketProvider.prototype, method).mockImplementation(_method);
				const ws = new WebSocketProvider('ws://localhost:8545');
				expect(ws).toBeDefined();
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
			jest.spyOn(WebSocketProvider.prototype, '_closeSocketConnection').mockImplementation(
				_closeSocketConnection,
			);
			// @ts-expect-error mock method
			jest.spyOn(WebSocketProvider.prototype, '_removeSocketListeners').mockImplementation(
				_removeSocketListeners,
			);
			// @ts-expect-error mock method
			jest.spyOn(WebSocketProvider.prototype, '_onDisconnect').mockImplementation(
				_onDisconnect,
			);
			const ws = new WebSocketProvider('ws://localhost:8545');
			expect(ws.getStatus()).toBe('connected');
			ws.disconnect(code, data);
			expect(_removeSocketListeners).toHaveBeenCalled();
			expect(_onDisconnect).toHaveBeenCalledWith(code, data);
			expect(_closeSocketConnection).toHaveBeenCalledWith(code, data);
		});
		it('getStatus', () => {
			const ws = new WebSocketProvider('ws://localhost:8545');
			expect(ws.getStatus()).toBe('connected');
			// @ts-expect-error mock field
			ws._socketConnection.readyState = 0;
			expect(ws.getStatus()).toBe('connecting');
			// @ts-expect-error mock field
			ws._socketConnection.readyState = 2;
			expect(ws.getStatus()).toBe('disconnected');
			// @ts-expect-error mock field
			ws._socketConnection = undefined;
			expect(ws.getStatus()).toBe('disconnected');
		});
		it('socketConnection.close', () => {
			const ws = new WebSocketProvider('ws://localhost:8545');
			const close = jest.fn();
			// @ts-expect-error mock method
			ws._socketConnection.close = close;
			const code = 1002;
			const data = 'data';
			ws.disconnect(code, data);
			expect(close).toHaveBeenCalledWith(code, data);
		});
		it('onCloseEvent autoReconnect=false', () => {
			const ws = new WebSocketProvider('ws://localhost:8545', {}, { autoReconnect: false });
			const _clearQueues = jest.fn();
			const _removeSocketListeners = jest.fn();
			const _onDisconnect = jest.fn();
			// @ts-expect-error mock method
			ws._socketConnection.close = jest.fn();

			// @ts-expect-error mock method
			ws._clearQueues = _clearQueues;
			// @ts-expect-error mock method
			ws._removeSocketListeners = _removeSocketListeners;
			// @ts-expect-error mock method
			ws._onDisconnect = _onDisconnect;

			const code = 1002;
			const data = 'data';
			// @ts-expect-error emit method
			ws._socketConnection.emit('close', { code, reason: data });
			expect(_clearQueues).toHaveBeenCalledWith({ code, reason: data });
			expect(_removeSocketListeners).toHaveBeenCalled();
			expect(_onDisconnect).toHaveBeenCalledWith(code, data);
		});
		it('onCloseEvent autoReconnect=true', () => {
			const ws = new WebSocketProvider('ws://localhost:8545');
			const _reconnect = jest.fn();
			// @ts-expect-error mock method
			ws._socketConnection.close = jest.fn();
			// @ts-expect-error mock method
			ws._reconnect = _reconnect;

			const code = 1002;
			const data = 'data';
			// @ts-expect-error emit event
			ws._socketConnection.emit('close', { code, reason: data });
			expect(_reconnect).toHaveBeenCalled();
		});
		it('listeners', () => {
			const ws = new WebSocketProvider('ws://localhost:8545');
			// @ts-expect-error mock method
			ws._socketConnection.listeners = () => {
				throw new Error('error');
			};
			const addEventListener = jest.fn();
			// @ts-expect-error mock method
			ws._socketConnection.addEventListener = addEventListener;

			// @ts-expect-error mock method
			ws._addSocketListeners();
			// @ts-expect-error mock method
			expect(addEventListener).toHaveBeenCalledWith('error', ws._onErrorHandler);
			const removeEventListener = jest.fn();
			// @ts-expect-error mock method
			ws._socketConnection.removeEventListener = removeEventListener;
			// @ts-expect-error mock method
			ws._removeSocketListeners();
			// @ts-expect-error mock method
			expect(removeEventListener).toHaveBeenCalledWith('message', ws._onMessageHandler);
			// @ts-expect-error mock method
			expect(removeEventListener).toHaveBeenCalledWith('open', ws._onOpenHandler);
			// @ts-expect-error mock method
			expect(removeEventListener).toHaveBeenCalledWith('close', ws._onCloseHandler);
		});
	});
});
