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

/* eslint-disable jest/no-disabled-tests */
/* eslint-disable jest/no-done-callback */
// todo remove console
import {
	EthExecutionAPI,
	JsonRpcId,
	Web3APIPayload,
	DeferredPromise,
	JsonRpcResponse,
} from 'web3-common';
// import WebSocketProvider from '../../src/index';
import WebSocketProvider from '../../src/index';
import { Web3WSProviderError } from '../../src/errors';
import { WSRequestItem } from '../../src/types';

// eslint-disable-next-line import/no-relative-packages
import { clientWsUrl, accounts } from '../../../../.github/test.config';

describe('WebSocketProvider - implemented methods', () => {
	jest.setTimeout(30000);
	let webSocketProvider: WebSocketProvider;
	let jsonRpcPayload: Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;
	// helper function
	let currentAttempt = 0;
	const waitForOpenConnection = async (provider: WebSocketProvider, status = 'connected') => {
		return new Promise<void>((resolve, reject) => {
			const maxNumberOfAttempts = 10;
			const intervalTime = 5000; // ms

			const interval = setInterval(() => {
				// console.warn('currentAttemp', currentAttempt);
				console.warn(webSocketProvider.getStatus());
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
	beforeEach(() => {
		jsonRpcPayload = {
			jsonrpc: '2.0',
			id: 42,
			method: 'eth_getBalance',
			params: [accounts[0].address, 'latest'],
		} as Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;
		webSocketProvider = new WebSocketProvider(
			clientWsUrl,
			{},
			{ delay: 1, autoReconnect: false, maxAttempts: 1 },
		);
		currentAttempt = 0;
	});
	afterEach(() => {
		webSocketProvider.disconnect();
	});

	describe('websocker provider tests', () => {
		it.skip('should connect', async () => {
			await waitForOpenConnection(webSocketProvider);
			expect(webSocketProvider).toBeInstanceOf(WebSocketProvider);
			expect(webSocketProvider.getStatus()).toBe('connected');
		});
	});

	describe('subscribe event tests', () => {
		it.skip('should subscribe on message', done => {
			webSocketProvider.on('message', (err, res) => {
				if (err) {
					done.fail(err);
				}
				expect(res?.id).toBe(jsonRpcPayload.id);
				done();
			});
			webSocketProvider.request(jsonRpcPayload).catch(err => {
				done.fail(err);
			});
		});

		it.skip('should subscribe on error', done => {
			const errorMsg = 'Custom WebSocket error occured';
			webSocketProvider.on('error', err => {
				expect(err?.message).toBe(errorMsg);
				done();
			});
			// Manually emit an error event - accessing private emitter
			// todo change it
			webSocketProvider['_wsEventEmitter'].emit('error', new Web3WSProviderError(errorMsg));
		});
		// eslint-disable-next-line jest/expect-expect
		it.skip('should subscribe on connect', done => {
			webSocketProvider.on('open', () => {
				done();
			});
		});
		it('should subscribe on close', done => {
			webSocketProvider.on('close', err => {
				console.warn(err);
				done();
			});
			waitForOpenConnection(webSocketProvider)
				.then(() => {
					webSocketProvider.disconnect(1001, '1001');
				})
				.catch(() => {
					done.fail();
				});
		});
	});
	describe('disconnect and reset test', () => {
		// eslint-disable-next-line jest/expect-expect
		it.skip('should disconnect', async () => {
			// eslint-disable-next-line @typescript-eslint/no-shadow
			// const webSocketProvider = new WebSocketProvider(
			// 	clientWsUrl,
			// 	// {},
			// 	// { delay: 1, autoReconnect: false, maxAttempts: 1 },
			// );
			// console.warn(typeof webSocketProvider.disconnect);

			// // await webSocketProvider.disconnect(1000, 'done');
			// console.warn(webSocketProvider.getStatus());
			const provider = new WebSocketProvider(
				clientWsUrl,
				{},
				{ delay: 1, autoReconnect: false, maxAttempts: 1 },
			);
			await waitForOpenConnection(provider);
			provider.disconnect(1000);
			await waitForOpenConnection(provider, 'disconnected');
		});
		it.skip('should reset', async () => {
			jsonRpcPayload = {
				jsonrpc: '2.0',
				id: 42,
				method: 'eth_getBalance',
				params: [accounts[0].address, 'latest'],
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
}); // eslint-disable-line import/no-relative-packages

// describe('unsubscribe', () => {
// 	let provider: WebSocketProvider;

// 	it('test', () => {
// 		provider = new WebSocketProvider(
// 			clientWsUrl,
// 			{},
// 			{ delay: 1, autoReconnect: false, maxAttempts: 1 },
// 		);
// 		provider.disconnect();
// 	});
// });
