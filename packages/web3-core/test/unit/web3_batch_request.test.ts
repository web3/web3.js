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

import { JsonRpcBatchRequest, JsonRpcBatchResponse, JsonRpcOptionalRequest } from 'web3-types';
import { jsonRpc, Web3DeferredPromise } from 'web3-utils';
import { OperationAbortError, OperationTimeoutError } from 'web3-errors';
import { Web3BatchRequest } from '../../src/web3_batch_request';

describe('Web3BatchRequest', () => {
	let requestManager: any;
	let batchRequest: Web3BatchRequest;
	let requestId = 0;

	beforeEach(() => {
		requestManager = {
			sendBatch: jest.fn(),
		};

		batchRequest = new Web3BatchRequest(requestManager);

		jest.spyOn(jsonRpc, 'toPayload').mockImplementation(request => {
			// eslint-disable-next-line no-plusplus
			return { ...request, id: request.id ?? ++requestId, jsonrpc: '2.0' };
		});
	});

	describe('constructor', () => {
		it('should create batch request object with empty list of requests', () => {
			expect(batchRequest).toBeInstanceOf(Web3BatchRequest);
			expect(batchRequest.requests).toEqual([]);
		});
	});

	describe('add', () => {
		it('should add request to the list', async () => {
			jest.spyOn(requestManager, 'sendBatch').mockResolvedValue([
				{ id: 1, jsonrpc: '2.0', result: 'result' },
			]);

			// This catch should never trigger
			batchRequest.add({ method: 'my_method', params: [], id: 1 }).catch(err => {
				throw err;
			});

			expect(batchRequest.requests).toEqual([
				{ method: 'my_method', params: [], id: 1, jsonrpc: '2.0' },
			]);

			// Make sure request didn't timeout
			await batchRequest.execute();
		});

		it('should return a deferred promise', async () => {
			jest.spyOn(requestManager, 'sendBatch').mockResolvedValue([
				{ id: 1, jsonrpc: '2.0', result: 'result' },
			]);

			const result = batchRequest.add({ id: 1, method: 'my_method', params: [] });
			expect(result).toBeInstanceOf(Web3DeferredPromise);

			// Make sure request didn't timeout
			await batchRequest.execute();
		});
	});

	describe('execute', () => {
		let request1: JsonRpcOptionalRequest;
		let request2: JsonRpcOptionalRequest;
		let batchPayload: JsonRpcBatchRequest;
		let response1: any;
		let response2: any;
		let batchResponse: JsonRpcBatchResponse;

		beforeEach(() => {
			request1 = { id: 10, method: 'my_method', params: [] };
			request2 = { id: 11, method: 'my_method2', params: [] };
			response1 = {
				id: 10,
				jsonrpc: '2.0',
				result: 'request-1-result',
			};
			response2 = {
				id: 11,
				jsonrpc: '2.0',
				result: 'request-2-result',
			};
			batchPayload = jsonRpc.toBatchPayload([request1, request2]);
			batchResponse = [response1, response2];

			jest.spyOn(requestManager, 'sendBatch').mockResolvedValue(batchResponse);
		});

		it('should send batch request to request manager', async () => {
			const res1 = batchRequest.add(request1);
			const res2 = batchRequest.add(request2);

			await batchRequest.execute();

			expect(requestManager.sendBatch).toHaveBeenCalledTimes(1);
			expect(requestManager.sendBatch).toHaveBeenCalledWith(batchPayload);
			await expect(res1).resolves.toBeDefined();
			await expect(res2).resolves.toBeDefined();
		});

		it('should throw error if response size does not match', async () => {
			jest.spyOn(requestManager, 'sendBatch').mockResolvedValue([response1]);

			const res1 = batchRequest.add(request1);
			const res2 = batchRequest.add(request2);

			await expect(batchRequest.execute()).rejects.toThrow(
				'Batch request size mismatch the results size. Requests: 2, Responses: 1',
			);
			await expect(res1).rejects.toThrow(new OperationAbortError('Invalid batch response'));
			await expect(res2).rejects.toThrow(new OperationAbortError('Invalid batch response'));
		});

		it('should throw error if response ids does not match', async () => {
			jest.spyOn(requestManager, 'sendBatch').mockResolvedValue([
				response1,
				{ ...response2, id: 1 },
			]);

			const res1 = batchRequest.add(request1);
			const res2 = batchRequest.add(request2);

			await expect(batchRequest.execute()).rejects.toThrow(
				'Batch request mismatch the results. Requests: [10,11], Responses: [1,10]',
			);
			await expect(res1).rejects.toThrow(new OperationAbortError('Invalid batch response'));
			await expect(res2).rejects.toThrow(new OperationAbortError('Invalid batch response'));
		});

		it('should resolve individual request on execution', async () => {
			const res1 = batchRequest.add(request1);
			const res2 = batchRequest.add(request2);

			await expect(batchRequest.execute()).resolves.toEqual([response1, response2]);
			await expect(res1).resolves.toEqual(response1.result);
			await expect(res2).resolves.toEqual(response2.result);
		});

		it('should resolve request with result and reject request with error', async () => {
			const responseWithError = {
				...response2,
				result: undefined,
				error: { message: 'RPC responded with error response', code: 12 },
			};
			jest.spyOn(requestManager, 'sendBatch').mockResolvedValue([
				response1,
				responseWithError,
			]);

			const res1 = batchRequest.add(request1);
			const res2 = batchRequest.add(request2);

			await expect(batchRequest.execute()).resolves.toEqual([response1, responseWithError]);
			await expect(res1).resolves.toEqual(response1.result);
			await expect(res2).rejects.toEqual(responseWithError.error);
		});

		it('should timeout if request not executed in a particular time', async () => {
			let timerId!: NodeJS.Timeout;

			jest.spyOn(requestManager, 'sendBatch').mockImplementation(async () => {
				return new Promise(resolve => {
					timerId = setTimeout(() => {
						resolve(batchResponse);
					}, 2000);
				});
			});

			const res1 = batchRequest.add(request1);
			const res2 = batchRequest.add(request2);

			await expect(batchRequest.execute()).rejects.toThrow(
				new OperationTimeoutError('Batch request timeout'),
			);
			await expect(res1).rejects.toThrow(new OperationAbortError('Batch request timeout'));
			await expect(res2).rejects.toThrow(new OperationAbortError('Batch request timeout'));

			clearTimeout(timerId);
		});
	});
});
