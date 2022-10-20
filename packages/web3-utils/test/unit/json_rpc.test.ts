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
	isResponseWithResult,
	isResponseWithError,
	isResponseWithNotification,
	isSubscriptionResult,
	isValidResponse,
	isBatchResponse,
	toPayload,
} from '../../src/json_rpc';
import {
	isResponseWithResultValidTest,
	isResponseWithErrorValidTest,
	isResponseWithNotificationValidTest,
	isSubscriptionResultValidTest,
	toPayloadValidTest,
	isValidResponseValidTest,
	isBatchResponseValidTest,
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
			it.each(isBatchResponseValidTest)('isValidresponse valid test', (input, output) => {
				const result = isBatchResponse(input);
				expect(result).toBe(output);
			});
		});
	});
	describe('toPayloadValid', () => {
		describe('valid cases', () => {
			it.each(toPayloadValidTest)('isValidresponse valid test', (input, output) => {
				const result = toPayload(input);
				expect(result).toStrictEqual(output);
			});
		});
	});
});
