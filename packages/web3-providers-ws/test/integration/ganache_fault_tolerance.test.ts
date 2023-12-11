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

import { ProviderRpcError } from 'web3-types/src/web3_api_types';
import ganache from 'ganache';
import { EthExecutionAPI, Web3APIPayload, SocketRequestItem, JsonRpcResponse } from 'web3-types';
import { InvalidResponseError, ConnectionNotOpenError } from 'web3-errors';
import { Web3DeferredPromise } from 'web3-utils';
import {
	waitForSocketConnect,
	waitForEvent,
	describeIf,
	getSystemTestBackend,
	isWs,
} from '../fixtures/system_test_utils';
import WebSocketProvider from '../../src/index';

// create helper functions to open server
describeIf(getSystemTestBackend() === 'ganache' && isWs)('ganache tests', () => {
	describe('WebSocketProvider - ganache', () => {
		jest.setTimeout(17000);
		const port = 7547;
		const host = `ws://localhost:${port}`;
		const jsonRpcPayload = {
			jsonrpc: '2.0',
			id: 43,
			method: 'eth_mining',
		} as Web3APIPayload<EthExecutionAPI, 'eth_mining'>;

		// simulate abrupt disconnection, ganache server always closes with code 1000 so we need to simulate closing with different error code
		const changeCloseCode = async (webSocketProvider: WebSocketProvider) =>
			new Promise<void>(resolve => {
				// @ts-expect-error replace close handler
				// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-param-reassign
				webSocketProvider._onCloseHandler = (_: CloseEvent) => {
					// @ts-expect-error replace close event
					webSocketProvider._onCloseEvent({ code: 1003 });
				};
				// @ts-expect-error run protected method
				webSocketProvider._removeSocketListeners();
				// @ts-expect-error run protected method
				webSocketProvider._addSocketListeners();
				resolve();
			});

		it('"error" when there is no connection', async () => {
			const reconnectionOptions = {
				delay: 100,
				autoReconnect: false,
				maxAttempts: 1,
			};
			const websocketProvider = new WebSocketProvider(
				'ws://localhost:7547',
				{},
				reconnectionOptions,
			);

			expect(!!(await waitForEvent(websocketProvider, 'error'))).toBe(true);
			websocketProvider.disconnect();
			await expect(websocketProvider.request(jsonRpcPayload)).rejects.toThrow(
				'Connection not open',
			);
		});

		it('"error" handler fires if the client closes unilaterally', async () => {
			const server = ganache.server();
			await server.listen(port);
			const webSocketProvider = new WebSocketProvider(host);

			await waitForSocketConnect(webSocketProvider);

			const disconnectPromise = waitForEvent(webSocketProvider, 'disconnect');
			await server.close();
			expect(!!(await disconnectPromise)).toBe(true);
			webSocketProvider.disconnect();
		});

		it('"error" handler *DOES NOT* fire if disconnection is clean', async () => {
			const server = ganache.server();
			await server.listen(port);
			const reconnectOptions = {
				autoReconnect: false,
			};
			const webSocketProvider = new WebSocketProvider(host, {}, reconnectOptions);
			await waitForSocketConnect(webSocketProvider);

			const mockReject = jest.fn();
			webSocketProvider.once('error', () => {
				mockReject();
			});
			webSocketProvider.disconnect();
			await new Promise(resolve => {
				setTimeout(() => {
					resolve(true);
				}, 100);
			});
			expect(mockReject).toHaveBeenCalledTimes(0);

			await server.close();
		});

		it('can connect after being disconnected', async () => {
			const server = ganache.server();
			await server.listen(port);

			const webSocketProvider = new WebSocketProvider(host);
			const mockCallback = jest.fn();
			const connectPromise = new Promise(resolve => {
				webSocketProvider.once('connect', () => {
					mockCallback();
					resolve(true);
				});
			});
			await connectPromise;

			webSocketProvider.disconnect();
			await waitForEvent(webSocketProvider, 'disconnect');

			webSocketProvider.connect();
			const connectPromise2 = new Promise(resolve => {
				webSocketProvider.once('connect', () => {
					mockCallback();
					resolve(true);
				});
			});
			await connectPromise2;
			webSocketProvider.disconnect();
			expect(mockCallback).toHaveBeenCalledTimes(2);
			await server.close();
		});

		it('webSocketProvider supports subscriptions', async () => {
			const server = ganache.server();
			await server.listen(port);
			const webSocketProvider = new WebSocketProvider(host);

			await waitForSocketConnect(webSocketProvider);
			expect(webSocketProvider.supportsSubscriptions()).toBe(true);

			webSocketProvider.disconnect();
			await server.close();
		});

		it('times out when server is closed', async () => {
			const server = ganache.server();
			await server.listen(port);
			const reconnectionOptions = {
				delay: 100,
				autoReconnect: false,
				maxAttempts: 1,
			};
			const webSocketProvider = new WebSocketProvider(host, {}, reconnectionOptions);
			const mockCallBack = jest.fn();
			const errorPromise = new Promise(resolve => {
				webSocketProvider.on('error', (err: unknown) => {
					if ((err as ProviderRpcError)?.message.startsWith('connect ECONNREFUSED')) {
						mockCallBack();
						resolve(true);
					}
				});
			});
			await server.close();
			await errorPromise;
			expect(mockCallBack).toHaveBeenCalled();
		});

		it('with reconnect on, will try to connect until server is open then close', async () => {
			const reconnectionOptions = {
				delay: 10,
				autoReconnect: true,
				maxAttempts: 100,
			};
			const webSocketProvider = new WebSocketProvider(host, {}, reconnectionOptions);

			const mockCallback = jest.fn();
			const connectPromise = new Promise(resolve => {
				webSocketProvider.on('connect', () => {
					mockCallback();
					resolve(true);
				});
			});

			const server = ganache.server();
			await server.listen(port);
			await connectPromise;
			webSocketProvider.disconnect();
			await server.close();
			expect(mockCallback).toHaveBeenCalledTimes(1);
		});

		it('allows disconnection on lost connection, when reconnect is enabled', async () => {
			const reconnectionOptions = {
				delay: 10,
				autoReconnect: true,
				maxAttempts: 100,
			};
			const webSocketProvider = new WebSocketProvider(host, {}, reconnectionOptions);

			const connectPromise = waitForSocketConnect(webSocketProvider);

			const server = ganache.server();
			await server.listen(port);
			await connectPromise;
			await server.close();
			const disconnectEvent = waitForEvent(webSocketProvider, 'disconnect');
			webSocketProvider.disconnect();
			expect(!!(await disconnectEvent)).toBe(true);
		});

		it('errors when failing to reconnect after data is lost mid-chunk', async () => {
			const server = ganache.server();
			await server.listen(port);
			const reconnectionOptions = {
				delay: 100,
				autoReconnect: true,
				maxAttempts: 1,
			};
			const mockCallBack = jest.fn();
			const webSocketProvider = new WebSocketProvider(host, {}, reconnectionOptions);
			await waitForSocketConnect(webSocketProvider);

			webSocketProvider.on('error', (err: any) => {
				if (err.message === `Maximum number of reconnect attempts reached! (${1})`) {
					mockCallBack();
				}
			});

			await server.close();

			// when server is not listening send request, and expect that lib will try to reconnect and at end will throw con not open error
			await expect(
				webSocketProvider.request(
				{"method":"eth_getBlockByNumber","params":["0xc5043f",false],"id":1,"jsonrpc":"2.0"}
				))
				.rejects.toThrow(ConnectionNotOpenError);

			expect(mockCallBack).toHaveBeenCalled();
		});

		it('times out when connection is lost mid-chunk', async () => {
			const server = ganache.server();
			await server.listen(port);
			const reconnectionOptions = {
				delay: 0,
				autoReconnect: false,
				maxAttempts: 0,
			};
			const webSocketProvider = new WebSocketProvider(host, {}, reconnectionOptions);
			await waitForSocketConnect(webSocketProvider);

			await server.close();

			const errorPromise = new Promise(resolve => {
				webSocketProvider.on('error', (err: any) => {
					expect(err).toBeInstanceOf(InvalidResponseError);
					if (err.cause.message === 'Chunk timeout') {
						resolve(true);
					}
				});
			});
			// send an event to be parsed and fail
			const event = {
				data: 'abc|--|ded',
				type: 'websocket',
				// @ts-expect-error run protected method
				target: webSocketProvider._socketConnection,
			};
			// @ts-expect-error run protected method
			webSocketProvider._parseResponses(event); // simulate chunks
			await errorPromise;
			expect(true).toBe(true);
		});

		it('clears pending requests on maxAttempts failed reconnection', async () => {
			const server = ganache.server();
			await server.listen(port);
			const reconnectionOptions = {
				delay: 1000,
				autoReconnect: true,
				maxAttempts: 1,
			};
			const mockCallBack = jest.fn();

			const webSocketProvider = new WebSocketProvider(host, {}, reconnectionOptions);
			const defPromise = new Web3DeferredPromise<JsonRpcResponse<ResponseType>>();
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			defPromise.catch(() => {});
			const reqItem: SocketRequestItem<any, any, any> = {
				payload: jsonRpcPayload,
				deferredPromise: defPromise,
			};
			await waitForSocketConnect(webSocketProvider);

			// add a request without executing promise
			// @ts-expect-error run protected method
			webSocketProvider._pendingRequestsQueue.set(jsonRpcPayload.id, reqItem);

			// simulate abrupt server close
			await changeCloseCode(webSocketProvider);
			const errorPromise = new Promise(resolve => {
				webSocketProvider.on('error', (error: unknown) => {
					if (
						(error as ProviderRpcError)?.message ===
						`Maximum number of reconnect attempts reached! (${1})`
					) {
						mockCallBack();
					}
					resolve(true);
				});
			});

			await server.close();
			await errorPromise;
			// @ts-expect-error run protected method
			expect(webSocketProvider._pendingRequestsQueue.size).toBe(0);
			expect(mockCallBack).toHaveBeenCalled();
		});

		it('queues requests made while connection is lost / executes on reconnect', async () => {
			const server = ganache.server();
			await server.listen(port);
			const reconnectionOptions = {
				delay: 1000,
				autoReconnect: true,
				maxAttempts: 3,
			};
			const webSocketProvider = new WebSocketProvider(host, {}, reconnectionOptions);
			await waitForSocketConnect(webSocketProvider);

			// simulate abrupt close code
			await changeCloseCode(webSocketProvider);
			const errorPromise = new Promise(resolve => {
				webSocketProvider.on('error', () => {
					resolve(true);
				});
			});
			await server.close();

			await errorPromise;
			// queue a request
			const requestPromise = webSocketProvider.request(jsonRpcPayload);

			const server2 = ganache.server();
			await server2.listen(port);

			await waitForSocketConnect(webSocketProvider);

			// try to send a request
			const result = await requestPromise;
			expect(result.id).toEqual(jsonRpcPayload.id);
			webSocketProvider.disconnect();
			await server2.close();
		});
		it('errors when requests continue after socket closed', async () => {
			const server = ganache.server();
			await server.listen(port);
			const reconnectOptions = {
				autoReconnect: false,
			};
			const webSocketProvider = new WebSocketProvider(host, {}, reconnectOptions);
			await waitForSocketConnect(webSocketProvider);

			const disconnectPromise = waitForEvent(webSocketProvider, 'disconnect');
			await server.close();

			await disconnectPromise;
			const errorPromise = new Promise(resolve => {
				webSocketProvider.on('error', () => {
					resolve(true);
				});
			});
			await expect(webSocketProvider.request(jsonRpcPayload)).rejects.toThrow(
				'Connection not open',
			);
			await errorPromise;
		});
		it('deferredPromise emits an error when request fails', async () => {
			const server = ganache.server();
			await server.listen(port);
			const webSocketProvider = new WebSocketProvider(host);
			await waitForSocketConnect(webSocketProvider);

			// @ts-expect-error replace sendtoSocket so we don't execute request
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			webSocketProvider._sendToSocket = () => {};
			webSocketProvider.on('error', (err: unknown) => {
				expect(err).toBeInstanceOf(ConnectionNotOpenError);
			});

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const request = webSocketProvider.request(jsonRpcPayload).catch(() => {});

			// @ts-expect-error create a deferred promise error
			webSocketProvider._clearQueues();

			await request;
			webSocketProvider.disconnect();
			await server.close();
		});
	});
});
