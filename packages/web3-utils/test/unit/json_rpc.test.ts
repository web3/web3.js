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
	isResponseRpcError,
	isResponseWithResult,
	isResponseWithError,
	isResponseWithNotification,
	isSubscriptionResult,
	isValidResponse,
	isBatchResponse,
	setRequestIdStart,
	toBatchPayload,
	isBatchRequest,
	toPayload,
} from '../../src/json_rpc';
import {
	isResponseWithResultValidTest,
	isResponseWithErrorValidTest,
	isResponseRpcErrorValidData,
	isResponseWithNotificationValidTest,
	isSubscriptionResultValidTest,
	toPayloadValidTest,
	isValidResponseValidTest,
	isBatchResponseValidTest,
	isBatchRequestValidData,
} from '../fixtures/json_rpc';

describe('json rpc tests', () => {
	describe('isResponseWithResult', () => {
		describe('valid cases', () => {
			it.each(isResponseWithResultValidTest)('%s', (input, output) => {
				const result = isResponseWithResult(input);
				expect(result).toBe(output);
			});
		});
	});
	describe('isResponseWithError', () => {
		describe('valid cases', () => {
			it.each(isResponseWithErrorValidTest)('should error', (input, output) => {
				const result = isResponseWithError(input);
				expect(result).toBe(output);
			});
		});
	});
	describe('isResponseRpcError', () => {
		describe('valid cases', () => {
			it.each(isResponseRpcErrorValidData)('%s', (input, output) => {
				const result = isResponseRpcError(input);
				expect(result).toBe(output);
			});
		});
	});
	describe('isResponseWithNotification', () => {
		describe('valid cases', () => {
			it.each(isResponseWithNotificationValidTest)('should have notify', (input, output) => {
				const result = isResponseWithNotification(input);
				expect(result).toBe(output);
			});
		});
	});
	describe('isSubscriptionResult', () => {
		describe('valid cases', () => {
			it.each(isSubscriptionResultValidTest)('subscription valid test', (input, output) => {
				const result = isSubscriptionResult(input);
				expect(result).toBe(output);
			});
		});
	});
	describe('isValidResponse', () => {
		describe('valid cases', () => {
			it.each(isValidResponseValidTest)('isValidresponse valid test', (input, output) => {
				const result = isValidResponse(input);
				expect(result).toBe(output);
			});
		});
	});
	describe('isBatchResponseValid', () => {
		describe('valid cases', () => {
			it.each(isBatchResponseValidTest)(
				'isBatchResponseValid valid test',
				(input, output) => {
					const result = isBatchResponse(input);
					expect(result).toBe(output);
				},
			);
		});
	});
	describe('isBatchRequest', () => {
		describe('valid cases', () => {
			it.each(isBatchRequestValidData)('isBatchRqeuest valid data', (input, output) => {
				expect(isBatchRequest(input)).toBe(output);
			});
		});
	});
	describe('toPayloadValid', () => {
		describe('valid cases', () => {
			beforeEach(() => {
				setRequestIdStart(undefined);
			});
			it.each(toPayloadValidTest)('toPayload valid test', async (input, output) => {
				const result = await new Promise(resolve => {
					resolve(toPayload(input));
				});
				expect(result).toStrictEqual(output);
			});
			it('should give payload that has requestid set', async () => {
				setRequestIdStart(1);
				const result = await new Promise(resolve => {
					resolve(toPayload({ method: 'delete' }));
				});
				expect(result).toStrictEqual({
					method: 'delete',
					id: 2,
					params: undefined,
					jsonrpc: '2.0',
				});
			});
		});
	});
	describe('toBatchPayload', () => {
		it('should batch payload', async () => {
			setRequestIdStart(0);
			const result = await new Promise(resolve => {
				resolve(toBatchPayload([{ method: 'delete' }, { method: 'add' }]));
			});
			expect(result).toStrictEqual([
				{ method: 'delete', id: 1, params: undefined, jsonrpc: '2.0' },
				{ method: 'add', id: 2, params: undefined, jsonrpc: '2.0' },
			]);
		});
	});
});
