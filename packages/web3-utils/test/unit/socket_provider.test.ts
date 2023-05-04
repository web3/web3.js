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

import { EventEmitter } from 'stream';
import { Web3APIPayload, EthExecutionAPI, JsonRpcResponse, Web3ProviderStatus } from 'web3-types';
// eslint-disable-next-line import/no-relative-packages
import { sleep } from '../../../../fixtures/utils';
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
		return this._connectionStatus;
	}
	// eslint-disable-next-line
	setStatus(status: Web3ProviderStatus) {
		this._connectionStatus = status;
	}
}

describe('SocketProvider', () => {
	const socketPath = `some_path`;
	const socketOption = { dummyOption: true } as const;

	describe('socket_provider unit tests', () => {
		describe('constructor', () => {
			it('should construct the instance of the provider', () => {
				const provider = new TestProvider(socketPath, socketOption);
				expect(provider).toBeInstanceOf(SocketProvider);
				expect(provider.SocketConnection).toEqual(dummySocketConnection);
			});
		});
		describe('testing _reconnect() method', () => {
			it('should not be called when { autoReconnect: false }', () => {
				const reconnectOptions = { autoReconnect: false };
				const provider = new TestProvider(socketPath, socketOption, reconnectOptions);
				// @ts-expect-error run protected method
				jest.spyOn(provider, '_reconnect').mockReturnValue('');
				provider.message('');
				// @ts-expect-error run protected method
				expect(provider._reconnect).not.toHaveBeenCalled();
			});
			it('should be called when { autoReconnect: true }', () => {
				const reconnectOptions = { autoReconnect: true };
				const provider = new TestProvider(socketPath, socketOption, reconnectOptions);
				// @ts-expect-error run protected method
				jest.spyOn(provider, '_reconnect').mockReturnValue('');
				provider.message('');
				// @ts-expect-error run protected method
				expect(provider._reconnect).toHaveBeenCalled();
			});
		});

		describe('testing connect() method', () => {
			it('should call method reconnect in case of error at _openSocketConnection', async () => {
				const provider = new TestProvider(socketPath, socketOption);
				// @ts-expect-error run protected method
				jest.spyOn(provider, '_openSocketConnection').mockImplementation(() => {
					throw new Error();
				});
				// @ts-expect-error run protected method
				jest.spyOn(provider, '_reconnect').mockReturnValue('');
				// @ts-expect-error run protected method
				provider.isReconnecting = true;
				provider.connect();

				await sleep(100);

				// @ts-expect-error run protected method
				expect(provider._reconnect).toHaveBeenCalled();
			});
			it('should call method reconnect in case of error at _addSocketListeners', async () => {
				const provider = new TestProvider(socketPath, socketOption);
				// @ts-expect-error run protected method
				jest.spyOn(provider, '_addSocketListeners').mockImplementation(() => {
					throw new Error();
				});
				// @ts-expect-error run protected method
				jest.spyOn(provider, '_reconnect').mockReturnValue('');
				// @ts-expect-error run protected method
				provider.isReconnecting = true;
				provider.connect();

				await sleep(100);

				// @ts-expect-error run protected method
				expect(provider._reconnect).toHaveBeenCalled();
			});
			it('should throw "Error while connecting..." in case of error inside `connect()`', () => {
				const dummyError = new Error('error');
				const provider = new TestProvider(socketPath, socketOption);
				// @ts-expect-error run protected method
				jest.spyOn(provider, '_addSocketListeners').mockImplementation(() => {
					throw dummyError;
				});
				expect(() => provider.connect()).toThrow(
					`Error while connecting to ${socketPath}. Reason: ${dummyError.message}`,
				);
			});
			it('should throw "Client URL ... is invalid" in case of error with no message inside `connect()`', () => {
				const provider = new TestProvider(socketPath, socketOption);
				// @ts-expect-error run protected method
				jest.spyOn(provider, '_addSocketListeners').mockImplementation(() => {
					throw new Error();
				});
				expect(() => provider.connect()).toThrow(`Client URL "${socketPath}" is invalid.`);
			});
		});

		describe('testing supportsSubscriptions() function', () => {
			it('should returns false when calling `supportsSubscriptions()`', () => {
				const provider = new TestProvider(socketPath, socketOption);
				expect(provider.supportsSubscriptions()).toBe(true);
			});
		});

		describe('testing on() method', () => {
			it('should internally call `_eventEmitter.on`', () => {
				const provider = new TestProvider(socketPath, socketOption);

				// @ts-expect-error run protected method
				const funcBSpy = jest.spyOn(provider._eventEmitter, 'on').mockReturnValue();
				const event = 'message';
				const func = () => {
					// ...
				};
				provider.on(event, func);
				expect(funcBSpy).toHaveBeenCalledWith(event, func);
			});
		});

		describe('testing once() method', () => {
			it('should internally call `_eventEmitter.once`', () => {
				const provider = new TestProvider(socketPath, socketOption);

				// @ts-expect-error run protected method
				const funcBSpy = jest.spyOn(provider._eventEmitter, 'once').mockReturnValue();
				const event = 'message';
				const func = () => {
					// ...
				};
				provider.once(event, func);
				expect(funcBSpy).toHaveBeenCalledWith(event, func);
			});
		});

		describe('testing removeListener() method', () => {
			it('should internally call `_eventEmitter.removeListener`', () => {
				const provider = new TestProvider(socketPath, socketOption);

				const funcBSpy = jest
					// @ts-expect-error run protected method
					.spyOn(provider._eventEmitter, 'removeListener')
					.mockReturnValue(new EventEmitter());
				const event = 'message';
				const func = () => {
					// ...
				};
				provider.removeListener(event, func);
				expect(funcBSpy).toHaveBeenCalledWith(event, func);
			});
		});

		describe('testing disconnect() method', () => {
			it('should internally call `super._onDisconnect` and change the connectionStatus to `disconnected`', () => {
				const provider = new TestProvider(socketPath, socketOption);

				const funcBSpy = jest
					// spy on provider.super._onDisconnect
					.spyOn(
						Object.getPrototypeOf(
							Object.getPrototypeOf(Object.getPrototypeOf(provider)),
						),
						'_onDisconnect',
					)
					.mockReturnValue(new EventEmitter());
				const code = 0;
				const data = '0x0';
				provider.disconnect(code, data);
				// @ts-expect-error run protected method
				expect(provider._connectionStatus).toBe('disconnected');
				expect(funcBSpy).toHaveBeenCalledWith(code, data);
			});
		});

		describe('testing reset() method', () => {
			it('should set `_reconnectAttempts` to 0', () => {
				const provider = new TestProvider(socketPath, socketOption);
				provider.reset();
				// @ts-expect-error run protected method
				expect(provider._reconnectAttempts).toBe(0);
			});
		});

		describe('testing request() method', () => {
			it('should throw if the _socketConnection is null', async () => {
				const provider = new TestProvider(socketPath, socketOption);
				const payload = { method: 'some_rpc_method' };
				// @ts-expect-error run protected method
				provider._socketConnection = undefined;
				await expect(provider.request(payload)).rejects.toThrow('Connection is undefined');
			});
			it('should throw if the payload id was not provided', async () => {
				const provider = new TestProvider(socketPath, socketOption);
				const payload = { method: 'some_rpc_method' };
				await expect(provider.request(payload)).rejects.toThrow('Request Id not defined');
			});
			it('should throw if the payload id was provided twice', async () => {
				const provider = new TestProvider(socketPath, socketOption);
				const payload = { id: 1, method: 'some_rpc_method' };
				provider.setStatus('connected');
				const reqPromise = provider.request(payload);
				expect(reqPromise).toBeInstanceOf(Promise);
				await expect(provider.request(payload)).rejects.toThrow(
					'Request already sent with following id: 1',
				);
			});

			it('should call `connect` when the status is `disconnected`', () => {
				const provider = new TestProvider(socketPath, socketOption);
				const payload = { id: 1, method: 'some_rpc_method' };
				provider.setStatus('disconnected');
				jest.spyOn(provider, 'connect').mockReturnValue();
				// @ts-expect-error run protected method
				jest.spyOn(provider, '_sendToSocket').mockReturnValue();
				provider
					.request(payload)
					.then(() => {
						// the status of the provider is manipulate manually to be disconnected,
						// 	for that, this request promise will never resolve
					})
					.catch(() => {
						// nothing
					});
				expect(provider.connect).toHaveBeenCalled();
			});
			it('should add request to the `_pendingRequestsQueue` when the status is `connecting`', () => {
				const provider = new TestProvider(socketPath, socketOption);
				const payload = { id: 1, method: 'some_rpc_method' };
				provider.setStatus('connecting');
				const reqPromise = provider.request(payload);
				expect(reqPromise).toBeInstanceOf(Promise);
				// @ts-expect-error run protected method
				expect(provider._pendingRequestsQueue.get(payload.id).payload).toBe(payload);
			});

			it('should add request to the `_sentRequestsQueue` when the status is `connected`', () => {
				const provider = new TestProvider(socketPath, socketOption);
				const payload = { id: 1, method: 'some_rpc_method' };
				provider.setStatus('connected');
				const reqPromise = provider.request(payload);
				expect(reqPromise).toBeInstanceOf(Promise);
				// @ts-expect-error run protected method
				expect(provider._sentRequestsQueue.get(payload.id).payload).toBe(payload);
			});
		});

		describe('testing _clearQueues() method', () => {
			it('should clear queues when called', () => {
				const provider = new TestProvider(socketPath, socketOption);
				const payload1 = { id: 1, method: 'some_rpc_method' };
				provider.setStatus('connecting');
				const req1 = provider.request(payload1);
				// when the queues will be cleared the promise will reject
				req1.catch(() => {
					// nothing
				});
				// @ts-expect-error run protected method
				expect(provider._pendingRequestsQueue.size).toBe(1);

				const payload2 = { id: 2, method: 'some_rpc_method' };
				provider.setStatus('connected');
				const req2 = provider.request(payload2);
				// when the queues will be cleared the promise will reject
				req2.catch(() => {
					// nothing
				});

				// @ts-expect-error run protected method
				expect(provider._sentRequestsQueue.size).toBe(1);

				provider.on('error', () => {
					// nothing
				});
				// @ts-expect-error run protected method
				provider._clearQueues();
				// @ts-expect-error run protected method
				expect(provider._pendingRequestsQueue.size).toBe(0);
				// @ts-expect-error run protected method
				expect(provider._sentRequestsQueue.size).toBe(0);
			});
		});
	});
});
