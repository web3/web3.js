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
	EthExecutionAPI,
	Web3APIPayload,
	JsonRpcNotification,
	JsonRpcSubscriptionResult,
	JsonRpcId,
	JsonRpcResponse,
} from 'web3-types';
import { Web3DeferredPromise } from 'web3-utils';

import { Web3WSProviderError } from 'web3-errors';
import WebSocketProvider from '../../src/index';
import { OnCloseEvent, WSRequestItem } from '../../src/types';
import { waitForOpenConnection } from '../fixtures/helpers';

import {
	getSystemTestProvider,
	describeIf,
	isWs,
	createTempAccount,
} from '../fixtures/system_test_utils';

type Resolve = (value?: unknown) => void;

describeIf(isWs)('WebSocketProvider - implemented methods', () => {
	let clientWsUrl: string;
	let tempAccount: string;
	let webSocketProvider: WebSocketProvider;
	let jsonRpcPayload: Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;
	// helper function
	let currentAttempt = 0;

	beforeAll(async () => {
		clientWsUrl = getSystemTestProvider();
		tempAccount = (await createTempAccount()).address;
	});
	beforeEach(() => {
		jsonRpcPayload = {
			jsonrpc: '2.0',
			id: 42,
			method: 'eth_getBalance',
			params: [tempAccount, 'latest'],
		} as Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;
		webSocketProvider = new WebSocketProvider(
			clientWsUrl,
			{},
			{ delay: 1, autoReconnect: false, maxAttempts: 1 },
		);
		currentAttempt = 0;
	});
	afterEach(async () => {
		// make sure we try to close the connection after it is established
		if (webSocketProvider.getStatus() === 'connecting') {
			await waitForOpenConnection(webSocketProvider, currentAttempt);
		}

		webSocketProvider.disconnect(1000);
	});

	describe('websocker provider tests', () => {
		it('should connect', async () => {
			await waitForOpenConnection(webSocketProvider, currentAttempt);
			expect(webSocketProvider).toBeInstanceOf(WebSocketProvider);
			expect(webSocketProvider.getStatus()).toBe('connected');
		});
	});

	describe('subscribe event tests', () => {
		it('should subscribe to `message` event', async () => {
			const messagePromise = new Promise((resolve: Resolve) => {
				webSocketProvider.on(
					'message',
					(
						error: Error | undefined,
						result?: JsonRpcSubscriptionResult | JsonRpcNotification<any>,
					) => {
						if (error) {
							throw new Error(error.message);
						}
						expect(result?.id).toBe(jsonRpcPayload.id);
						resolve();
					},
				);
			});
			await webSocketProvider.request(jsonRpcPayload);
			await messagePromise;
		});

		it('should subscribe to `error` event that could happen at the underlying WebSocket connection', async () => {
			const errorMsg = 'Custom WebSocket error occurred';

			const errorPromise = new Promise((resolve: Resolve) => {
				webSocketProvider.on('error', (err: any) => {
					expect(err?.message).toBe(errorMsg);
					resolve();
				});
			});

			webSocketProvider['_webSocketConnection']?.emit(
				'error',
				new Web3WSProviderError(errorMsg),
			);
			await errorPromise;
		});

		it('should subscribe to `connect` event', async () => {
			const openPromise = new Promise((resolve: Resolve) => {
				webSocketProvider.on('open', () => {
					resolve('resolved');
				});
			});
			await expect(openPromise).resolves.toBe('resolved');
		});

		it('should subscribe to `close` event', async () => {
			const code = 1000;

			const closePromise = new Promise((resolve: Resolve) => {
				webSocketProvider.on('close', (err?: Error, event?: OnCloseEvent) => {
					if (err) {
						throw new Error(err.message);
					}
					expect(event?.code).toEqual(code);
					resolve();
				});
			});
			currentAttempt = 0;
			await waitForOpenConnection(webSocketProvider, currentAttempt);
			webSocketProvider.disconnect(code);
			await closePromise;
		});
	});

	describe('disconnect and reset test', () => {
		it('should disconnect', async () => {
			const provider = new WebSocketProvider(
				clientWsUrl,
				{},
				{ delay: 1, autoReconnect: false, maxAttempts: 1 },
			);
			await waitForOpenConnection(provider, currentAttempt);
			provider.disconnect(1000);
			await waitForOpenConnection(provider, currentAttempt, 'disconnected');
			expect(provider.getStatus()).toBe('disconnected');
		});

		it('should reset', async () => {
			class TestReset extends WebSocketProvider {
				public pendigRequestsSize() {
					return this._pendingRequestsQueue.size;
				}

				public sentRequestsSize() {
					return this._pendingRequestsQueue.size;
				}

				public setPendingRequest(id: JsonRpcId, reqItem: WSRequestItem<any, any, any>) {
					this._pendingRequestsQueue.set(id, reqItem);
				}

				public setSentRequest(id: JsonRpcId, reqItem: WSRequestItem<any, any, any>) {
					this._sentRequestsQueue.set(id, reqItem);
				}
			}
			const testResetProvider = new TestReset(
				clientWsUrl,
				{},
				{ delay: 1, autoReconnect: false, maxAttempts: 1 },
			);

			await waitForOpenConnection(testResetProvider, currentAttempt);

			const defPromise = new Web3DeferredPromise<JsonRpcResponse<ResponseType>>();

			const reqItem: WSRequestItem<any, any, any> = {
				payload: jsonRpcPayload,
				deferredPromise: defPromise,
			};

			testResetProvider.setPendingRequest(jsonRpcPayload.id, reqItem);
			expect(testResetProvider.pendigRequestsSize()).toBe(1);

			testResetProvider.setSentRequest(jsonRpcPayload.id, reqItem);
			expect(testResetProvider.sentRequestsSize()).toBe(1);

			testResetProvider.reset();
			expect(testResetProvider.pendigRequestsSize()).toBe(0);
			expect(testResetProvider.sentRequestsSize()).toBe(0);

			testResetProvider.disconnect(1000);
		});
	});

	describe('getStatus get and validate all status tests', () => {
		it('should getStatus `connecting`', () => {
			expect(webSocketProvider.getStatus()).toBe('connecting');
		});

		it('should getStatus `connected`', async () => {
			await waitForOpenConnection(webSocketProvider, currentAttempt);
			expect(webSocketProvider.getStatus()).toBe('connected');
		});
		it('should getStatus `disconnected`', async () => {
			await waitForOpenConnection(webSocketProvider, currentAttempt);
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

		it('should send multiple requests', async () => {
			const prom1 = webSocketProvider.request(jsonRpcPayload);

			const prom2 = webSocketProvider.request(jsonRpcPayload2);

			const prom3 = webSocketProvider.request(jsonRpcPayload3);

			const values = await Promise.all([prom1, prom2, prom3]);
			expect(values).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ id: jsonRpcPayload.id }),
					expect.objectContaining({ id: jsonRpcPayload2.id }),
					expect.objectContaining({ id: jsonRpcPayload3.id }),
				]),
			);

			// Execute request in connected stated too
			const prom3Value = await prom3;
			expect(prom3Value).toEqual(
				expect.objectContaining({
					id: jsonRpcPayload3.id,
				}),
			);
		});
	});
});
