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

// eslint-disable-next-line import/no-extraneous-dependencies
import ganache from 'ganache';
import { InvalidResponseError } from 'web3-errors';
// import { ConnectionNotOpenError } from 'web3-errors';
import WebSocketProvider from '../../src/index';

// create helper functions to open server
describe('ganache tests', () => {
	describe('WebSocketProvider - ganache', () => {
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
			); // _openSocketConnection hangs
			const mockFunction = jest.fn();
			const errorPromise = new Promise(resolve => {
				websocketProvider.on('error', () => {
					mockFunction();
					resolve(true);
				});
			});
			await errorPromise;
			websocketProvider.disconnect();
			expect(mockFunction).toHaveBeenCalled();
		});

		it('"error" handler fires if the client closes unilaterally', async () => {
			const port = 7547;
			const host = `ws://localhost:${port}`;
			const server = ganache.server();
			await server.listen(port);
			const webSocketProvider = new WebSocketProvider(host);

			const connectPromise = new Promise(resolve => {
				webSocketProvider.on('connect', () => {
					resolve(true);
				});
			});
			await connectPromise;

			const mockCallback = jest.fn();
			const prom = new Promise(resolve => {
				webSocketProvider.on('disconnect', () => {
					mockCallback();
					resolve(true);
				});
			});
			webSocketProvider.disconnect();
			await prom;
			expect(mockCallback).toHaveBeenCalled();
			await server.close();
		});

		it('"error" handler *DOES NOT* fire if disconnection is clean', async () => {
			const port = 7547;
			const host = `ws://localhost:${port}`;
			const server = ganache.server();
			await server.listen(port);
			const reconnectOptions = {
				autoReconnect: false,
			};
			const webSocketProvider = new WebSocketProvider(host, {}, reconnectOptions);
			const connectPromise = new Promise(resolve => {
				webSocketProvider.on('connect', () => {
					resolve(true);
				});
			});
			await connectPromise;
			const mockReject = jest.fn();
			webSocketProvider.once('error', () => {
				mockReject();
			});
			webSocketProvider.disconnect();
			await new Promise(resolve => {
				const id = setTimeout(() => {
					clearTimeout(id);
					resolve(true);
				}, 100);
			});
			expect(mockReject).toHaveBeenCalledTimes(0);

			await server.close();
		});

		it('can connect after being disconnected', async () => {
			const port = 7547;
			const host = `ws://localhost:${port}`;
			const server = ganache.server();
			await server.listen(port);

			const wsProvider = new WebSocketProvider(host);
			const mockCallback = jest.fn();
			const connectPromise = new Promise(resolve => {
				wsProvider.once('connect', () => {
					mockCallback();
					resolve(true);
				});
			});
			await connectPromise;
			//
			wsProvider.disconnect();
			const disconnectPromise = new Promise(resolve => {
				wsProvider.once('disconnect', () => {
					resolve(true);
				});
			});
			await disconnectPromise;

			wsProvider.connect();
			const connectPromise2 = new Promise(resolve => {
				wsProvider.once('connect', () => {
					mockCallback();
					resolve(true);
				});
			});
			await connectPromise2;
			wsProvider.disconnect();
			expect(mockCallback).toHaveBeenCalledTimes(2);
			await server.close();
		});

		it('wsprovider supports subscriptions', async () => {
			const port = 7547;
			const host = `ws://localhost:${port}`;
			const server = ganache.server();
			await server.listen(port);
			const webSocketProvider = new WebSocketProvider(host);

			const connectPromise = new Promise(resolve => {
				webSocketProvider.on('connect', () => {
					resolve(true);
				});
			});
			await connectPromise;

			expect(webSocketProvider.supportsSubscriptions()).toBe(true);

			// const web3 = new Web3(webSocketProvider);
			// expect(web3.eth.currentProvider.supportsSubscriptions()).toBe(true); // Unsafe call of an `any` typed value.
			webSocketProvider.disconnect();
			await server.close();
		});

		it('times out when server is closed', async () => {
			const port = 7547;
			const host = `ws://localhost:${port}`;
			const server = ganache.server();
			await server.listen(port);
			const reconnectionOptions = {
				delay: 100,
				autoReconnect: false,
				maxAttempts: 1,
			};
			const webSocketProvider = new WebSocketProvider(host, {}, reconnectionOptions);

			const errorPromise = new Promise(resolve => {
				webSocketProvider.on('error', (err: any) => {
					expect(err).toBeDefined();
					resolve(true);
				});
			});
			await server.close();
			await errorPromise;
		});

		it('with reconnect on, will try to connect until server is open and close properly', async () => {
			const port = 7547;
			const host = `ws://localhost:${port}`;
			const reconnectionOptions = {
				delay: 10,
				autoReconnect: true,
				maxAttempts: 100,
			};
			const webSocketProvider = new WebSocketProvider(host, {}, reconnectionOptions);

			const mockCallback = jest.fn();
			const connectPromise1 = new Promise(resolve => {
				webSocketProvider.on('connect', () => {
					mockCallback();
					resolve(true);
				});
			});

			const server = ganache.server();
			await server.listen(port);
			await connectPromise1;
			webSocketProvider.disconnect();
			await server.close();
			expect(mockCallback).toHaveBeenCalledTimes(1);
		});

		it('allows disconnection on lost connection, when reconnect is enabled', async () => {
			const port = 7547;
			const host = `ws://localhost:${port}`;
			const reconnectionOptions = {
				delay: 10,
				autoReconnect: true,
				maxAttempts: 100,
			};
			const webSocketProvider = new WebSocketProvider(host, {}, reconnectionOptions);

			const mockCallback = jest.fn();
			const connectPromise1 = new Promise(resolve => {
				webSocketProvider.on('connect', () => {
					mockCallback();
					resolve(true);
				});
			});

			const server = ganache.server();
			await server.listen(port);
			await connectPromise1;
			webSocketProvider.disconnect();
			await server.close();
			expect(mockCallback).toHaveBeenCalledTimes(1);
		});

		it('errors when failing to reconect after data is lost mid-chunk', async () => {
			jest.setTimeout(17000); // chunk parser error will only timeout after 15000
			const port = 7547;
			const host = `ws://localhost:${port}`;
			const server = ganache.server();
			await server.listen(port);
			const reconnectionOptions = {
				delay: 1000,
				autoReconnect: true,
				maxAttempts: 1,
			};
			const webSocketProvider = new WebSocketProvider(host, {}, reconnectionOptions);

			const connectPromise = new Promise(resolve => {
				webSocketProvider.on('connect', () => {
					resolve(true);
				});
			});
			await connectPromise;
			await server.close();
			try {
				// @ts-expect-error run protected method
				webSocketProvider._parseResponses({ data: 'abc|--|dedf' });
			} catch (error) {
				// eslint-disable-next-line jest/no-conditional-expect
				expect(error).toThrow(InvalidResponseError);
			}
			// @ts-expect-error run protected method
			webSocketProvider._clearQueues();
			webSocketProvider.disconnect();
		});

		// it('times out in mid chunk', async () => {
		// 	const port = 7547;
		// 	const host = `ws://localhost:${port}`;
		// 	const server = ganache.server();
		// 	await server.listen(port);
		// 	const webSocketProvider = new WebSocketProvider(host, {timeout: 10});

		// 	const errorPromise = new Promise(resolve => {
		// 		webSocketProvider.on('error', (err:any) => {
		// 			console.log(err);
		// 			expect(err).toBeDefined();
		// 			resolve(true);
		// 		});
		// 	});

		// 	// eslint-disable-next-line
		// 	// const event: WebSocket.MessageEvent = {data: 'abc|--|ded', type: 'websocket', target: webSocketProvider._socketConnection}
		// 	// eslint-disable-next-line
		// 	// await errorPromise;
		// 	await server.close();
		// 	await errorPromise;

		// });
		// it('errors when requests continue after socket closed', async () => {
		// 	const port = 7547;
		// 	const host = `ws://localhost:${port}`;
		// 	const server = ganache.server();
		// 	await server.listen(port);
		// 	const reconnectOptions = {
		// 		 	autoReconnect: false
		// 	}
		// 	const webSocketProvider = new WebSocketProvider(host, {}, reconnectOptions);
		// 	const connectPromise = new Promise(resolve => {
		// 		webSocketProvider.on('connect', () => {
		// 			resolve(true);
		// 		});
		// 	});

		// 	await connectPromise;

		// 	const web3 = new Web3(webSocketProvider);

		// 	const pr = new Promise((resolve) => {
		// 		webSocketProvider.once('disonnect', () => {
		// 			// try to send a request now that socket is closed
		// 			console.log("disconnect")
		// 			resolve(true);
		// 		})
		// 		webSocketProvider.once('error', () => {
		// 			// try to send a request now that socket is closed
		// 			console.log("error")
		// 			resolve(true);
		// 		})
		// 		webSocketProvider.once('close', () => {
		// 			// try to send a request now that socket is closed
		// 			console.log("close")
		// 			resolve(true);
		// 		})
		// 		webSocketProvider.once('message', () => {
		// 			// try to send a request now that socket is closed
		// 			console.log("message")
		// 			resolve(true);
		// 		})
		// 		webSocketProvider.once('wsClientError', () => {
		// 			// try to send a request now that socket is closed
		// 			console.log("message")
		// 			resolve(true);
		// 		})
		// 	})

		// 	await server.close();
		// 	console.log("2")
		// 	await new Promise(resolve => {
		// 		const id = setTimeout(() => {
		// 			clearTimeout(id);
		// 			resolve(true);
		// 		}, 500);
		// 	});
		// 	await expect(web3.eth.getBlockNumber()).rejects.toThrow();

		// });
	});
});
