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

import {
	Web3APIPayload,
	EthExecutionAPI,
	JsonRpcResponse,
	Web3ProviderStatus,
	JsonRpcIdentifier,
} from 'web3-types';
import { MaxAttemptsReachedOnReconnectingError, InvalidClientError } from 'web3-errors';
import { EventEmitter } from '../../src/event_emitter';
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
	protected _parseResponses(_event: { data: string } | undefined): JsonRpcResponse[] {
		if (!_event || !_event.data) {
			return [];
		}
		const returnValues: JsonRpcResponse[] = [];

		// DE-CHUNKER
		const dechunkedData = _event.data
			.replace(/\}[\n\r]?\{/g, '}|--|{') // }{
			.replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
			.replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
			.replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
			.split('|--|');

		dechunkedData.forEach((chunkData: string) => {
			const result = JSON.parse(chunkData) as unknown as JsonRpcResponse;

			if (result) returnValues.push(result);
		});

		return returnValues;
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
			it('should call _clearQueues when chunkResponseParser emits an error', async () => {
				const provider = new TestProvider(socketPath, socketOption, { delay: 0 });
				const clearQueuesSpy = jest.spyOn(provider as any, '_clearQueues');

				try {
					// @ts-expect-error access readonly method
					provider['chunkResponseParser']['autoReconnect'] = false;
					// @ts-expect-error access readonly method
					provider['chunkResponseParser']['chunkTimeout'] = 0;

					provider['chunkResponseParser'].parseResponse('invalid-json');
				} catch (error) {
					// nothing
				}

				// wait 1 second for the timeout to trigger
				await sleep(100);

				expect(clearQueuesSpy).toHaveBeenCalled();
			});
			it('should error when failing to _validateProviderPath', () => {
				expect(() => {
					// eslint-disable-next-line no-new
					new TestProvider('', socketOption, { delay: 0 });
				}).toThrow(InvalidClientError);
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
			it('should not call _reconnect with empty response when { autoReconnect: true }', () => {
				const reconnectOptions = { autoReconnect: true };
				const provider = new TestProvider(socketPath, socketOption, reconnectOptions);
				// @ts-expect-error run protected method
				jest.spyOn(provider, '_reconnect').mockReturnValue('');
				provider.message('');
				// @ts-expect-error run protected method
				expect(provider._reconnect).not.toHaveBeenCalled();
			});
			it('should call _reconnect when isReconnecting is true and an error happens', () => {
				const provider = new TestProvider(socketPath, socketOption);
				provider['_reconnect'] = jest.fn();
				provider['isReconnecting'] = true;

				provider['_onError']({});

				expect(provider['_reconnect']).toHaveBeenCalled();
			});

			it('should call _reconnect when isReconnecting is false and an error happens', () => {
				const provider = new TestProvider(socketPath, socketOption);
				provider['_reconnect'] = jest.fn();
				provider['isReconnecting'] = false;

				provider['_onError']({});
				expect(provider['_reconnect']).not.toHaveBeenCalled();
			});

			it('should return if the provider is already isReconnecting', async () => {
				const provider = new TestProvider(socketPath, socketOption, { delay: 0 });
				// just to run the test faster moke `connect`
				jest.spyOn(provider, 'connect');

				// @ts-expect-error access protected method
				expect(provider._reconnectAttempts).toBe(0);
				provider['_reconnect']();
				// @ts-expect-error access protected method
				expect(provider._reconnectAttempts).toBe(1);

				// after the first call  provider.isReconnecting will set to true and so the `_reconnectAttempts` will not be incremented
				provider['_reconnect']();

				// @ts-expect-error access protected method
				expect(provider._reconnectAttempts).toBe(1);
			});

			it('should reconnect the socket when the number of reconnect attempts is less than the maximum attempts', async () => {
				const provider = new TestProvider(socketPath, socketOption, { delay: 0 });
				// @ts-expect-error access protected method
				const openSocketConnectionSpy = jest.spyOn(provider, '_openSocketConnection');
				// @ts-expect-error access protected method
				const removeSocketListenersSpy = jest.spyOn(provider, '_removeSocketListeners');
				const connectSpy = jest.spyOn(provider, 'connect');

				// Set the reconnect attempts to less than the maximum attempts
				provider['_reconnectAttempts'] = 2;

				provider['_reconnect']();

				// wait for the timeout to trigger
				await sleep(100);

				expect(openSocketConnectionSpy).toHaveBeenCalled();
				expect(removeSocketListenersSpy).toHaveBeenCalled();
				expect(connectSpy).toHaveBeenCalled();
			});

			it('should clear the queues and emit an error event when the number of reconnect attempts reaches the maximum attempts', async () => {
				const provider = new TestProvider(socketPath, socketOption, { delay: 0 });
				const clearQueuesSpy = jest.spyOn(provider as any, '_clearQueues');
				// @ts-expect-error access protected method
				const removeSocketListenersSpy = jest.spyOn(provider, '_removeSocketListeners');
				const errorEventSpy = jest.spyOn(provider['_eventEmitter'], 'emit');

				// Set the reconnect attempts to the maximum attempts
				provider['_reconnectAttempts'] = 5;

				provider['_reconnect']();

				// wait for the timeout to trigger
				await sleep(100);

				expect(clearQueuesSpy).toHaveBeenCalled();
				expect(removeSocketListenersSpy).toHaveBeenCalled();
				expect(errorEventSpy).toHaveBeenCalledWith(
					'error',
					expect.any(MaxAttemptsReachedOnReconnectingError),
				);
			});

			it('should keep pending requests but clear the sent requests queue when reconnecting', async () => {
				const provider = new TestProvider(socketPath, socketOption, { delay: 0 });

				provider.setStatus('connected');
				// Add a sent request
				provider.request({ id: 2, method: 'some_rpc_method' }).catch(() => {
					// it will throw with "Connection not open" because no actual connection is used in the test. So ignore the error
				});
				// @ts-expect-error run protected method
				expect(provider._sentRequestsQueue.size).toBe(1);

				// @ts-expect-error access protected method
				const rejectSpy = jest.spyOn(provider['_pendingRequestsQueue'], 'delete');
				const deleteSpy = jest.spyOn(provider['_sentRequestsQueue'], 'delete');

				const pendingRequestsQueueSize = provider['_pendingRequestsQueue'].size;
				const sentRequestsQueueSize = provider['_sentRequestsQueue'].size;

				provider['_reconnect']();

				expect(provider['_pendingRequestsQueue'].size).toEqual(pendingRequestsQueueSize);

				expect(deleteSpy).toHaveBeenCalledTimes(sentRequestsQueueSize);
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

			it('should add request to the `_sentRequestsQueue` when the status is `connected` for batch requests', () => {
				const provider = new TestProvider(socketPath, socketOption);
				const payload = [
					{ id: 1, method: 'some_rpc_method', jsonrpc: '2.0' as JsonRpcIdentifier },
					{ id: 2, method: 'some_rpc_method', jsonrpc: '2.0' as JsonRpcIdentifier },
				];
				provider.setStatus('connected');
				const reqPromise = provider.request(payload as any);
				expect(reqPromise).toBeInstanceOf(Promise);

				// the id of the first request in the batch is the one used to identify the batch request
				// @ts-expect-error run protected method
				expect(provider._sentRequestsQueue.get(payload[0].id).payload).toBe(payload);
			});

			it('should clear _sentRequestsQueue in case `_sendToSocket` had an error', async () => {
				// Create a mock SocketProvider instance
				const provider = new TestProvider(socketPath, socketOption, { delay: 0 });

				const deleteSpy = jest.spyOn(provider['_sentRequestsQueue'], 'delete');

				provider.setStatus('connected');
				// Assert that the _sendToSocket method was called with the correct payload
				// @ts-expect-error access protected method
				provider._sendToSocket = () => {
					throw new Error('any error');
				};
				// Call the request method
				provider
					.request({ id: 1, method: 'some_rpc_method' })
					.then(() => {
						// nothing
					})
					.catch(() => {
						// nothing
					});

				expect(deleteSpy).toHaveBeenCalled();
			});
		});
		describe('testing _onConnect() method', () => {
			it('should catch error when succesfully connecting with _sendPendingRequests in queue and _sendToSocket throws', async () => {
				const provider = new TestProvider(socketPath, socketOption, { delay: 0 });
				provider.setStatus('connecting');
				const payload1 = { id: 1, method: 'some_rpc_method' };
				const errorEventSpy = jest.fn();
				provider.on('error', errorEventSpy);

				// @ts-expect-error access protected method
				provider._sendToSocket = () => {
					throw new Error('any error');
				};
				provider
					.request(payload1)
					.then(() => {
						// nothing
					})
					.catch(() => {
						// nothing
					});
				// @ts-expect-error run protected method
				provider._onConnect();

				expect(errorEventSpy).toHaveBeenCalledWith(expect.any(Error));
				expect(provider.getPendingRequestQueueSize()).toBe(0);
				expect(provider.getSentRequestsQueueSize()).toBe(0);
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
				expect(provider.getPendingRequestQueueSize()).toBe(1);
				const payload2 = { id: 2, method: 'some_rpc_method' };
				provider.setStatus('connected');
				const req2 = provider.request(payload2);
				// when the queues will be cleared the promise will reject
				req2.catch(() => {
					// nothing
				});

				// @ts-expect-error run protected method
				expect(provider._sentRequestsQueue.size).toBe(1);
				expect(provider.getSentRequestsQueueSize()).toBe(1);

				provider.on('error', () => {
					// nothing
				});
				// @ts-expect-error run protected method
				provider._clearQueues();
				// @ts-expect-error run protected method
				expect(provider._pendingRequestsQueue.size).toBe(0);
				expect(provider.getPendingRequestQueueSize()).toBe(0);
				// @ts-expect-error run protected method
				expect(provider._sentRequestsQueue.size).toBe(0);
				expect(provider.getSentRequestsQueueSize()).toBe(0);
			});
		});
	});

	describe('safeDisconnect', () => {
		it('should disconnect the socket when there are no pending or sent requests', async () => {
			const provider = new TestProvider(socketPath, socketOption);
			const disconnectSpy = jest.spyOn(provider, 'disconnect');
			await provider.safeDisconnect();
			expect(disconnectSpy).toHaveBeenCalled();
		});

		it('should disconnect the socket after waiting for pending and sent requests to be empty', async () => {
			const provider = new TestProvider(socketPath, socketOption);
			const disconnectSpy = jest.spyOn(provider, 'disconnect');

			// Add a pending request
			provider.request({ id: 1, method: 'some_rpc_method' }).catch(() => {
				// it will throw with "Connection not open" because no actual connection is used in the test. So ignore the error
			});
			// Add a sent request
			provider.request({ id: 2, method: 'some_rpc_method' }).catch(() => {
				// it will throw with "Connection not open" because no actual connection is used in the test. So ignore the error
			});
			expect(provider.getPendingRequestQueueSize()).toBe(2);

			provider.clearQueues();
			// Call safeDisconnect and wait for the queues to be empty
			await provider.safeDisconnect(undefined, undefined, false, 100);

			expect(disconnectSpy).toHaveBeenCalled();
			expect(provider.getPendingRequestQueueSize()).toBe(0);
			expect(provider.getSentRequestsQueueSize()).toBe(0);
		});

		it('should force disconnect the socket after waiting for 5 attempts', async () => {
			const provider = new TestProvider(socketPath, socketOption);
			const disconnectSpy = jest.spyOn(provider, 'disconnect');
			const clearQueuesSpy = jest.spyOn(provider as any, 'clearQueues');

			// Add a pending request
			provider.request({ id: 1, method: 'some_rpc_method' }).catch(() => {
				// it will throw with "Connection not open" because no actual connection is used in the test. So ignore the error
			});
			expect(provider.getPendingRequestQueueSize()).toBe(1);

			// Add a sent request
			provider.request({ id: 2, method: 'some_rpc_method' }).catch(() => {
				// it will throw with "Connection not open" because no actual connection is used in the test. So ignore the error
			});
			// expect(provider.getSentRequestsQueueSize()).toBe(1);

			// Call safeDisconnect with forceDisconnect set to true and a small interval
			await provider.safeDisconnect(undefined, undefined, true, 100);

			expect(disconnectSpy).toHaveBeenCalled();
			expect(clearQueuesSpy).toHaveBeenCalled();
		});
	});
	describe('removeAllListeners', () => {
		it('should remove all listeners for the specified event type', () => {
			const provider = new TestProvider(socketPath, socketOption);
			const listener1 = jest.fn();
			const listener2 = jest.fn();
			const listener3 = jest.fn();
			provider.on('event', listener1);
			provider.on('event', listener2);
			provider.on('otherEvent', listener3);

			provider.removeAllListeners('event');

			provider['_eventEmitter'].emit('event');
			provider['_eventEmitter'].emit('otherEvent');

			expect(listener1).not.toHaveBeenCalled();
			expect(listener2).not.toHaveBeenCalled();
			expect(listener3).toHaveBeenCalled();
		});
	});

	describe('_sendPendingRequests', () => {
		it('should send pending requests to the socket', () => {
			const provider = new TestProvider(socketPath, socketOption, { delay: 0 });

			const payload1 = { id: 1, method: 'method1', params: [] };
			const payload2 = { id: 2, method: 'method2', params: [] };
			// Add a pending request
			provider.request(payload1).catch(() => {
				// it will throw with "Connection not open" because no actual connection is used in the test. So ignore the error
			});
			// Add a sent request
			provider.request(payload2).catch(() => {
				// it will throw with "Connection not open" because no actual connection is used in the test. So ignore the error
			});
			expect(provider.getPendingRequestQueueSize()).toBe(2);

			provider['_sendToSocket'] = jest.fn();

			provider['_sendPendingRequests']();

			expect(provider['_sendToSocket']).toHaveBeenCalledTimes(2);
			expect(provider['_sendToSocket']).toHaveBeenCalledWith(payload1);
			expect(provider['_sendToSocket']).toHaveBeenCalledWith(payload2);
			expect(provider['_pendingRequestsQueue'].size).toBe(0);
			expect(provider['_sentRequestsQueue'].size).toBe(2);
		});

		it('should not send any requests if the pending requests queue is empty', () => {
			const provider = new TestProvider(socketPath, socketOption, { delay: 0 });
			provider['_sendToSocket'] = jest.fn();

			provider['_sendPendingRequests']();

			expect(provider['_sendToSocket']).not.toHaveBeenCalled();
			expect(provider['_pendingRequestsQueue'].size).toBe(0);
			expect(provider['_sentRequestsQueue'].size).toBe(0);
		});
	});

	describe('_onConnect', () => {
		beforeEach(() => {
			jest.spyOn(console, 'error').mockImplementation(() => {
				// do nothing
			}); // Spy on console.error to suppress and check calls
		});

		afterEach(() => {
			jest.restoreAllMocks(); // Restore all mocks after each test
		});

		it('should set the connection status to "connected"', () => {
			const provider = new TestProvider(socketPath, socketOption, { delay: 0 });

			// Act
			provider['_onConnect']();

			expect(provider['_connectionStatus']).toBe('connected');
		});
		it('should set _accounts and _chainId when _getAccounts and _getChainId resolve', async () => {
			const provider = new TestProvider(socketPath, socketOption, { delay: 0 });
			jest.spyOn(provider as any, '_getAccounts').mockResolvedValueOnce([123]);
			jest.spyOn(provider as any, '_getChainId').mockResolvedValueOnce('1');

			await new Promise(resolve => {
				provider['_onConnect']();
				resolve('');
			});
			expect((provider as any)._chainId).toBe('1');
			expect((provider as any)._accounts).toEqual([123]);
		});
		it('chainID should change when connecting twice', async () => {
			const provider = new TestProvider(socketPath, socketOption, { delay: 0 });

			await new Promise(resolve => {
				jest.spyOn(provider as any, '_getAccounts').mockResolvedValueOnce([123]);
				jest.spyOn(provider as any, '_getChainId').mockResolvedValueOnce('1');
				provider['_onConnect']();
				resolve('');
			});
			expect((provider as any)._chainId).toBe('1');
			expect((provider as any)._accounts).toEqual([123]);

			await new Promise(resolve => {
				jest.spyOn(provider as any, '_getAccounts').mockResolvedValueOnce([123]);
				jest.spyOn(provider as any, '_getChainId').mockResolvedValueOnce('2');
				provider['_onConnect']();
				resolve('');
			});
			expect((provider as any)._chainId).toBe('2');
			expect((provider as any)._accounts).toEqual([123]);
		});
		it('should catch errors when _getAccounts and _getChainId throws', async () => {
			const provider = new TestProvider(socketPath, socketOption, { delay: 0 });
			jest.spyOn(provider as any, '_getChainId').mockRejectedValueOnce(new Error(''));
			jest.spyOn(provider as any, '_getAccounts').mockRejectedValueOnce(new Error(''));
			jest.spyOn(provider, 'request').mockReturnValue(new Error() as unknown as Promise<any>);

			await new Promise(resolve => {
				provider['_onConnect']();
				resolve('');
			});
			expect((provider as any)._chainId).toBe('');
			expect((provider as any)._accounts).toEqual([]);
		});
		it('should catch when connect emit fails', async () => {
			const provider = new TestProvider(socketPath, socketOption, { delay: 0 });
			jest.spyOn(provider as any, '_getChainId').mockResolvedValueOnce(1);
			jest.spyOn(provider as any, '_getAccounts').mockResolvedValueOnce([]);
			(provider as any)._eventEmitter.emit = jest.fn(() => {
				throw new Error('event emitter failed');
			});

			await new Promise(resolve => {
				provider['_onConnect']();
				resolve('');
			});
			// I would check if console.error is called, but facing a race condition
			expect((provider as any)._eventEmitter.emit).toHaveBeenCalledTimes(1);
		});
	});

	describe('_getChainId', () => {
		it('should return data from the chainId method', async () => {
			const provider = new TestProvider(socketPath, socketOption, { delay: 0 });
			const chainId = 1;
			jest.spyOn(provider as any, 'request').mockResolvedValueOnce({ result: chainId });
			const result = await provider['_getChainId']();
			expect(result).toBe(chainId);
		});

		it('should be returning undefined from the chainId method', async () => {
			const provider = new TestProvider(socketPath, socketOption, { delay: 0 });
			jest.spyOn(provider as any, 'request').mockResolvedValueOnce({ result: undefined });
			const result = await provider['_getChainId']();
			expect(result).toBe('');
		});

		it('should return empty from the chainId method', async () => {
			const provider = new TestProvider(socketPath, socketOption, { delay: 0 });
			jest.spyOn(provider as any, 'request').mockResolvedValueOnce(undefined);
			const result = await provider['_getChainId']();
			expect(result).toBe('');
		});
	});

	describe('_getAccounts', () => {
		it('should return data from the _getAccounts method', async () => {
			const provider = new TestProvider(socketPath, socketOption, { delay: 0 });
			const accounts = [1];
			jest.spyOn(provider as any, 'request').mockResolvedValueOnce({ result: accounts });
			const result = await provider['_getAccounts']();
			expect(result).toBe(accounts);
		});

		it('should returning undefined from the _getAccounts method', async () => {
			const provider = new TestProvider(socketPath, socketOption, { delay: 0 });
			jest.spyOn(provider as any, 'request').mockResolvedValueOnce({ result: undefined });
			const result = await provider['_getAccounts']();
			expect(result).toEqual([]);
		});

		it('should return empty from the _getAccounts method', async () => {
			const provider = new TestProvider(socketPath, socketOption, { delay: 0 });
			jest.spyOn(provider as any, 'request').mockResolvedValueOnce(undefined);
			const result = await provider['_getAccounts']();
			expect(result).toEqual([]);
		});
	});

	describe('_onMessage', () => {
		it('should resolve the deferred promise for valid responses with errors', () => {
			const provider = new TestProvider(socketPath, socketOption, { delay: 0 });

			const payload1 = {
				id: 1,
				method: 'method1',
				params: [],
				jsonrpc: '2.0' as JsonRpcIdentifier,
				error: { code: -32601, message: 'Method not found' },
			};
			const event = {
				data: JSON.stringify(payload1),
			};
			// Add a pending request
			provider.request(payload1).catch(() => {
				// it will throw with "Connection not open" because no actual connection is used in the test. So ignore the error
			});
			expect(provider.getPendingRequestQueueSize()).toBe(1);

			// @ts-expect-error access protected method
			provider['_sentRequestsQueue'] = provider['_pendingRequestsQueue'];

			const deferredPromiseResolveSpy = jest.spyOn(
				provider['_sentRequestsQueue'].get(1)!.deferredPromise,
				'resolve',
			);
			provider['_onMessage']({
				...event,
			});

			expect(deferredPromiseResolveSpy).toHaveBeenCalledWith(payload1);
		});

		it('should not emit "message" event for invalid responses', () => {
			const provider = new TestProvider(socketPath, socketOption, { delay: 0 });
			const event = {
				data: JSON.stringify([
					{ id: 1, jsonrpc: '2.0', error: { code: -32601, message: 'Method not found' } },
					{ id: 2, jsonrpc: '2.0', error: { code: -32601, message: 'Method not found' } },
				]),
			};

			const eventEmitterSpy = jest.spyOn(provider['_eventEmitter'], 'emit');

			provider['_onMessage'](event);

			expect(eventEmitterSpy).not.toHaveBeenCalledWith('message', {
				id: 1,
				jsonrpc: '2.0',
				error: { code: -32601, message: 'Method not found' },
			});
			expect(eventEmitterSpy).not.toHaveBeenCalledWith('message', {
				id: 2,
				jsonrpc: '2.0',
				error: { code: -32601, message: 'Method not found' },
			});
		});

		it('should emit "message" event for notifications', () => {
			const provider = new TestProvider(socketPath, socketOption, { delay: 0 });
			const event = {
				data: JSON.stringify({
					jsonrpc: '2.0',
					method: 'notification_1_subscription',
					params: {},
				}),
			};

			const eventEmitterSpy = jest.spyOn(provider['_eventEmitter'], 'emit');

			provider['_onMessage'](event);

			expect(eventEmitterSpy).toHaveBeenCalledWith('message', {
				jsonrpc: '2.0',
				method: 'notification_1_subscription',
				params: {},
			});
		});
	});
});
