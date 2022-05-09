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

/* eslint-disable jest/no-done-callback */
import {
	EthExecutionAPI,
	JsonRpcId,
	Web3APIPayload,
	DeferredPromise,
	JsonRpcResponse,
	JsonRpcNotification,
	JsonRpcSubscriptionResult,
} from 'web3-common';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { Server } from 'http';
import { Web3WSProviderError } from 'web3-errors';
import WebSocketProvider from '../../src/index';
// import { Web3WSProviderError } from '../../src/errors';
import { WSRequestItem, OnCloseEvent } from '../../src/types';

import {
	getSystemTestProvider,
	describeIf,
	getSystemTestAccounts,
} from '../fixtures/system_test_utils';

describeIf(getSystemTestProvider().includes('ws'))(
	'WebSocketProvider - implemented methods',
	() => {
		let clientWsUrl: string;
		let accounts: string[];
		let webSocketProvider: WebSocketProvider;
		let jsonRpcPayload: Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;
		// helper function
		let currentAttempt = 0;
		const waitForOpenConnection = async (provider: WebSocketProvider, status = 'connected') => {
			return new Promise<void>((resolve, reject) => {
				const maxNumberOfAttempts = 10;
				const intervalTime = 5000; // ms

				const interval = setInterval(() => {
					if (currentAttempt > maxNumberOfAttempts - 1) {
						clearInterval(interval);
						reject(new Error('Maximum number of attempts exceeded'));
					} else if (provider.getStatus() === status) {
						clearInterval(interval);
						resolve();
					}
					// eslint-disable-next-line no-plusplus
					currentAttempt++;
				}, intervalTime);
			});
		};
		beforeAll(async () => {
			clientWsUrl = getSystemTestProvider();
			accounts = await getSystemTestAccounts();
		});
		describe('tests', () => {
			beforeEach(() => {
				jsonRpcPayload = {
					jsonrpc: '2.0',
					id: 42,
					method: 'eth_getBalance',
					params: [accounts[0], 'latest'],
				} as Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;
				webSocketProvider = new WebSocketProvider(
					clientWsUrl,
					{},
					{ delay: 1, autoReconnect: false, maxAttempts: 1 },
				);
				currentAttempt = 0;
			});
			afterEach(async () => {
				if (webSocketProvider.getStatus() !== 'disconnected') {
					// make sure we try to close the connection after it is established
					await waitForOpenConnection(webSocketProvider);
					webSocketProvider.disconnect();
				}
			});

			describe('websocker provider tests', () => {
				it('should connect', async () => {
					await waitForOpenConnection(webSocketProvider);
					expect(webSocketProvider).toBeInstanceOf(WebSocketProvider);
					expect(webSocketProvider.getStatus()).toBe('connected');
				});
			});

			describe('subscribe event tests', () => {
				it('should subscribe on message', done => {
					webSocketProvider.on(
						'message',
						(
							error: Error | null,
							result?: JsonRpcSubscriptionResult | JsonRpcNotification<any>,
						) => {
							if (error) {
								done.fail(error);
							}
							expect(result?.id).toBe(jsonRpcPayload.id);
							done();
						},
					);
					webSocketProvider.request(jsonRpcPayload).catch(err => {
						done.fail(err);
					});
				});

				it('should subscribe on error', done => {
					const errorMsg = 'Custom WebSocket error occured';
					webSocketProvider.on('error', (err: any) => {
						expect(err?.message).toBe(errorMsg);
						done();
					});

					webSocketProvider['_wsEventEmitter'].emit(
						'error',
						new Web3WSProviderError(errorMsg),
					);
				});

				// eslint-disable-next-line jest/expect-expect
				it('should subscribe on connect', done => {
					webSocketProvider.on('open', () => {
						done();
					});
				});

				it('should subscribe on close', done => {
					const code = 1001;
					// const provider = new WebSocketProvider(clientWsUrl);
					webSocketProvider.on(
						'close',
						(err: Error | null, event: OnCloseEvent | null | undefined) => {
							if (err) {
								done.fail(err);
							}
							expect(event!.code).toEqual(code);
							done();
						},
					);
					currentAttempt = 0;
					waitForOpenConnection(webSocketProvider)
						.then(() => {
							webSocketProvider.disconnect(code);
						})
						.catch(() => {
							done.fail();
						});
				});
			});
			describe('disconnect and reset test', () => {
				it('should disconnect', async () => {
					const provider = new WebSocketProvider(
						clientWsUrl,
						{},
						{ delay: 1, autoReconnect: false, maxAttempts: 1 },
					);
					await waitForOpenConnection(provider);
					provider.disconnect(1000);
					await waitForOpenConnection(provider, 'disconnected');
					expect(provider.getStatus()).toBe('disconnected');
				});
				it('should reset', () => {
					jsonRpcPayload = {
						jsonrpc: '2.0',
						id: 42,
						method: 'eth_getBalance',
						params: [accounts[0], 'latest'],
					} as Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;
					const defPromise = new DeferredPromise<JsonRpcResponse<ResponseType>>();

					const reqItem: WSRequestItem<any, any, any> = {
						payload: jsonRpcPayload,
						deferredPromise: defPromise,
					};

					webSocketProvider['_requestQueue'].set(jsonRpcPayload.id as JsonRpcId, reqItem);
					expect(webSocketProvider['_requestQueue'].size).toBe(1);

					webSocketProvider['_sentQueue'].set(jsonRpcPayload.id as JsonRpcId, reqItem);
					expect(webSocketProvider['_sentQueue'].size).toBe(1);

					webSocketProvider.reset();
					expect(webSocketProvider['_requestQueue'].size).toBe(0);
					expect(webSocketProvider['_sentQueue'].size).toBe(0);
				});
			});

			describe('getStatus get and validate all status tests', () => {
				it('test getStatus `connecting`', () => {
					expect(webSocketProvider.getStatus()).toBe('connecting');
				});

				it('test getStatus `connected`', async () => {
					await waitForOpenConnection(webSocketProvider);
					expect(webSocketProvider.getStatus()).toBe('connected');
				});
				it('test getStatus `disconnected`', async () => {
					await waitForOpenConnection(webSocketProvider);
					webSocketProvider.disconnect();
					expect(webSocketProvider.getStatus()).toBe('disconnected');
				});
			});
			describe('send multiple Requests on same connection with valid payload and receive response tests', () => {
				// eslint-disable-next-line jest/expect-expect
				let jsonRpcPayload2: Web3APIPayload<EthExecutionAPI, 'eth_mining'>;
				let jsonRpcPayload3: Web3APIPayload<EthExecutionAPI, 'eth_hashrate'>;
				beforeAll(() => {
					jsonRpcPayload2 = {
						jsonrpc: '2.0',
						id: 43,
						method: 'eth_mining',
					} as Web3APIPayload<EthExecutionAPI, 'eth_mining'>;
					jsonRpcPayload3 = {
						jsonrpc: '2.0',
						id: 44,
						method: 'eth_hashrate',
					} as Web3APIPayload<EthExecutionAPI, 'eth_hashrate'>;
				});
				it('multiple requests', done => {
					const prom1 = webSocketProvider.request(jsonRpcPayload);

					const prom2 = webSocketProvider.request(jsonRpcPayload2);

					const prom3 = webSocketProvider.request(jsonRpcPayload3);

					Promise.all([prom1, prom2, prom3])
						.then(values => {
							// eslint-disable-next-line jest/no-conditional-expect
							expect(values).toEqual(
								expect.arrayContaining([
									expect.objectContaining({ id: jsonRpcPayload.id }),
									expect.objectContaining({ id: jsonRpcPayload2.id }),
									expect.objectContaining({ id: jsonRpcPayload3.id }),
								]),
							);
							// Execute request in connected stated too
							prom3
								.then(value => {
									// eslint-disable-next-line jest/no-conditional-expect
									expect(value).toEqual(
										expect.objectContaining({
											id: jsonRpcPayload3.id,
										}),
									);
									done();
								})
								.catch(err => {
									done.fail(err.message);
								});
						})
						.catch(err => {
							done.fail(err.message);
						});
				});
			});
		});
		describe('Support of Basic Auth', () => {
			let server: Server;
			beforeAll(() => {
				const app = express();
				const PORT = 3000;
				const HOST = 'localhost';

				const wsProxy = createProxyMiddleware({
					target: clientWsUrl,
					changeOrigin: true,
					ws: true,
					onError: () => {
						console.warn('************** proxy error');
					},
					logLevel: 'silent',
				});

				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				app.use(wsProxy);
				server = app.listen(PORT, HOST);

				server.on('upgrade', (req, socket, head) => {
					if (
						!req.headers.authorization ||
						!req.headers.authorization?.includes('Basic ')
					) {
						socket.emit('error');
						socket.destroy();
					}
					const base64Credentials: string = req.headers.authorization!.split(' ')[1];
					const credentials: string = Buffer.from(base64Credentials, 'base64').toString(
						'ascii',
					);
					const [username, password] = credentials.split(':');
					if (username !== 'geth' || password !== 'authpass') {
						socket.emit('error');
						socket.destroy();
					}
					return wsProxy.upgrade?.(req as any, socket as any, head);
				});
			});
			afterAll(() => {
				server.close();
			});
			// eslint-disable-next-line jest/expect-expect
			it('should connect with basic auth', async () => {
				webSocketProvider = new WebSocketProvider(
					'ws://geth:authpass@localhost:3000',
					{},
					{ delay: 1, autoReconnect: false, maxAttempts: 1 },
				);

				await waitForOpenConnection(webSocketProvider);
				webSocketProvider.disconnect();
			});
		});
	},
);
