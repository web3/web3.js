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

import { ExampleSubscription } from './fixtures/example_subscription';
import { Web3EventEmitter } from '../../src/web3_event_emitter';
import { Web3SubscriptionManager } from '../../src';

describe('Web3Subscription', () => {
	let requestManager: any;
	let subscriptionManager: Web3SubscriptionManager<any, any>;
	let eipRequestManager: any;
	let subscriptionManagerWithEipReqMan: Web3SubscriptionManager<any, any>;
	let provider: Web3EventEmitter<any>;
	let eipProvider: Web3EventEmitter<any>;

	beforeEach(() => {
		provider = new Web3EventEmitter();
		eipProvider = new Web3EventEmitter();
		// @ts-expect-error add to test eip providers
		eipProvider.request = jest.fn();
		requestManager = {
			send: jest.fn().mockImplementation(async () => {
				return 'sub-id';
			}),
			on: jest.fn(),
			provider,
		};
		subscriptionManager = new Web3SubscriptionManager(requestManager, {});

		eipRequestManager = {
			send: jest.fn().mockImplementation(async () => {
				return 'sub-id';
			}),
			on: jest.fn(),
			provider: eipProvider,
		};
		subscriptionManagerWithEipReqMan = new Web3SubscriptionManager(eipRequestManager, {});
	});

	describe('providers response for old provider', () => {
		it('data with result', async () => {
			const sub = new ExampleSubscription({ param1: 'param1' }, { subscriptionManager });
			await sub.subscribe();
			const testData = {
				data: {
					subscription: sub.id,
					result: {
						some: 1,
					},
				},
			};
			const processResult = jest.spyOn(sub, '_processSubscriptionResult');
			provider.emit('data', testData);
			expect(processResult).toHaveBeenCalledWith(testData.data.result);
		});

		it('data without result for old provider', async () => {
			const sub = new ExampleSubscription({ param1: 'param1' }, { subscriptionManager });
			await sub.subscribe();
			const testData = {
				data: {
					subscription: sub.id,
					other: {
						some: 1,
					},
				},
			};
			const processResult = jest.spyOn(sub, '_processSubscriptionResult');
			provider.emit('data', testData);
			expect(processResult).toHaveBeenCalledWith(testData.data);
		});
		it('data with result for eipProvider', async () => {
			const sub = new ExampleSubscription(
				{ param1: 'param1' },
				{ subscriptionManager: subscriptionManagerWithEipReqMan },
			);
			await sub.subscribe();
			const testData = {
				data: {
					subscription: sub.id,
					result: {
						some: 1,
					},
				},
			};
			const processResult = jest.spyOn(sub, '_processSubscriptionResult');
			eipProvider.emit('message', testData);
			expect(processResult).toHaveBeenCalledWith(testData.data.result);
		});

		it('data without result for eipProvider', async () => {
			const sub = new ExampleSubscription(
				{ param1: 'param1' },
				{ subscriptionManager: subscriptionManagerWithEipReqMan },
			);
			await sub.subscribe();
			const testData = {
				data: {
					subscription: sub.id,
					other: {
						some: 1,
					},
				},
			};
			const processResult = jest.spyOn(sub, '_processSubscriptionResult');
			eipProvider.emit('message', testData);
			expect(processResult).toHaveBeenCalledWith(testData.data);
		});
	});
});
