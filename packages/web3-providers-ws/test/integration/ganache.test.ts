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
// import { ConnectionNotOpenError } from 'web3-errors';
import WebSocketProvider from '../../src/index';

// create helper functions to open server
describe('ganache tests', () => {

	describe('WebSocketProvider - ganache', () => {


		// it('"error" when there is no connection', async () => {
		// 	const websocketProvider = new WebSocketProvider('ws://localhost:7547'); // _openSocketConnection hangs

		// 	const mockFunction = jest.fn();
		// 	const errorPromise = new Promise((resolve) => {
		// 		websocketProvider.on("error", () => {
		// 			mockFunction();
		// 			resolve(true);
		// 		})
		// 	});
		// 		await errorPromise;
		// 	websocketProvider.disconnect();
		// 	expect(mockFunction).toHaveBeenCalled();
		// });

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
				autoReconnect: false
	   }
			const webSocketProvider = new WebSocketProvider(host, {}, reconnectOptions);
			const connectPromise = new Promise(resolve => {
				webSocketProvider.on("connect", () => {
					resolve(true);
				})
			})
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

			const mockConnectCallBack = jest.fn();

			const webSocketProvider = new WebSocketProvider(host);
			const connectPromise = new Promise((resolve) => {
				webSocketProvider.once('connect', () => {
					mockConnectCallBack();
					resolve(true);
				})
			})
			await connectPromise;

			const prom = new Promise((resolve) =>{
				webSocketProvider.on("disconnect", () => {
					resolve(true);
				})
			})
			console.log("disconnect")
			webSocketProvider.disconnect();
			await prom;
			console.log("after disconnect")
			
			webSocketProvider.connect();

			const connectPromise2 = new Promise ((resolve) => {
				webSocketProvider.once('connect', () => {
				mockConnectCallBack();
				resolve(true);
			})
		})
			console.log("connect again")
			// })
			await connectPromise2;
			console.log("after")
			expect(mockConnectCallBack).toHaveBeenCalledTimes(2);
			await server.close();

		});

		// it('"end" handler fires with close event object if Web3 disconnects', async () => {

		// 	const port = 7547;
		// 	const host = `ws://localhost:${port}`;
		// 	const server = ganache.server();
		// 	await server.listen(port);
		// 	const webSocketProvider = new WebSocketProvider(host);

		// 	const connectPromise = new Promise(resolve => {
		// 		webSocketProvider.on('connect', () => {
		// 			resolve(true);
		// 		});
		// 	});

		// 	await connectPromise;
		// 	const pr = new Promise((resolve) => {
		// 		webSocketProvider.once('disconnect', () => {
		// 			resolve(true);
		// 		})
		// 	})
		// 	webSocketProvider.disconnect();
		// 	const result = await pr;
		// 	expect(result).toBe(true);

		// 	await server.close();

		// });

		// it('errors after client has disconnected', async () => {

		// 	const port = 7547;
		// 	const host = `ws://localhost:${port}`;
		// 	const server = ganache.server();
		// 	await server.listen(port);
		// 	const webSocketProvider = new WebSocketProvider(host);

		// 	// verify connection
		// 	const connectPromise = new Promise(resolve => {
		// 		webSocketProvider.on('connect', () => {
		// 			resolve(true);
		// 		});
		// 	});
		// 	const web3 = new Web3(webSocketProvider);
		// 	await connectPromise;

			
		// 	const pr = new Promise((resolve) => {
		// 		webSocketProvider.once('disconnect', () => {
		// 			resolve(true);
		// 		})
		// 	})
		// 	webSocketProvider.disconnect(1000);
		// 	await pr;
		// 	// try {
		// 	// 	await web3.eth.getBlockNumber();
		// 	// } catch (error) {
		// 	// 	console.log("error")
		// 	// 	console.log(error)
		// 	// 	expect(error).toThrow(new ConnectionNotOpenError());
		// 	// }
		// 	await expect(web3.eth.getBlockNumber()).rejects.toThrow(new ConnectionNotOpenError());

		// 	await server.close();

		// });

		// it('wsprovider supports subscriptions', async () => {
		// 	const port = 7548;
		// 	const host = `ws://localhost:${port}`;
		// 	const server = ganache.server();
		// 	await server.listen(port);
		// 	const webSocketProvider = new WebSocketProvider(host);

		// 	expect(webSocketProvider.supportsSubscriptions()).toBe(true);

		// 	// const web3 = new Web3(webSocketProvider);
		// 	// expect(web3.eth.currentProvider.supportsSubscriptions()).toBe(true); // Unsafe call of an `any` typed value.
		// 	await server.close();
		// });

		// it('times out when server is closed', async () => {
		// 	const port = 7547;
		// 	const host = `ws://localhost:${port}`;
		// 	const server = ganache.server();
		// 	await server.listen(port);
		// 	const webSocketProvider = new WebSocketProvider(host, {timeout: 10});
			
		// 	const errorPromise = new Promise(resolve => {
		// 		webSocketProvider.on('error', (err:any) => {
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

		// it('manually reconnect', async () => {
		// 	const port = 7547;
		// 	const host = `ws://localhost:${port}`;
		// 	const server = ganache.server();
		// 	await server.listen(port);
		// 	const webSocketProvider = new WebSocketProvider(host);
			
		// 	const mockCallback = jest.fn();
		// 	const connectPromise1 = new Promise(() => {webSocketProvider.once('connect', () => {
		// 		mockCallback();
		// 		})
		// 	})
		// 	await connectPromise1;
			
		// 	const connectPromise2 = new Promise(() => {webSocketProvider.once('connect', () => {
		// 			mockCallback();
		// 		})
		// 	})

		// 	await connectPromise2;

		// 	// eslint-disable-next-line
		// 	// const event: WebSocket.MessageEvent = {data: 'abc|--|ded', type: 'websocket', target: webSocketProvider._socketConnection}
		// 	// eslint-disable-next-line
		// 	// await errorPromise;
		// 	await server.close();
		// 	expect(mockCallback).toHaveBeenCalledTimes(2);
		// });

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
