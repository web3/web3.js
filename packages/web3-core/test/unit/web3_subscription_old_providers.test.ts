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

describe('Web3Subscription', () => {
	let requestManager: any;
	let eipRequestManager: any;
	let provider: Web3EventEmitter<any>;
	let eipProvider: Web3EventEmitter<any>;

	beforeEach(() => {
		provider = new Web3EventEmitter();
		eipProvider = new Web3EventEmitter();
		// @ts-expect-error add to test eip providers
		eipProvider.request = jest.fn();
		requestManager = { send: jest.fn(), on: jest.fn(), provider };
		eipRequestManager = { send: jest.fn(), on: jest.fn(), provider: eipProvider };
	});

	describe('providers response for old provider', () => {
		it('data with result', async () => {
			const testData = {
				data: {
					result: {
						some: 1,
					},
				},
			};
			const sub = new ExampleSubscription({ param1: 'param1' }, { requestManager });
			await sub.subscribe();
			// @ts-expect-error spy on protected method
			const processResult = jest.spyOn(sub, '_processSubscriptionResult');
			provider.emit('data', testData);
			expect(processResult).toHaveBeenCalledWith(testData.data.result);
		});

		it('data without result for old provider', async () => {
			const testData = {
				data: {
					other: {
						some: 1,
					},
				},
			};
			const sub = new ExampleSubscription({ param1: 'param1' }, { requestManager });
			await sub.subscribe();
			// @ts-expect-error spy on protected method
			const processResult = jest.spyOn(sub, '_processSubscriptionResult');
			provider.emit('data', testData);
			expect(processResult).toHaveBeenCalledWith(testData.data);
		});
		it('data with result for eipProvider', async () => {
			const testData = {
				data: {
					result: {
						some: 1,
					},
				},
			};
			const sub = new ExampleSubscription(
				{ param1: 'param1' },
				{ requestManager: eipRequestManager },
			);
			await sub.subscribe();
			// @ts-expect-error spy on protected method
			const processResult = jest.spyOn(sub, '_processSubscriptionResult');
			eipProvider.emit('message', testData);
			expect(processResult).toHaveBeenCalledWith(testData.data.result);
		});

		it('data without result for eipProvider', async () => {
			const testData = {
				data: {
					other: {
						some: 1,
					},
				},
			};
			const sub = new ExampleSubscription(
				{ param1: 'param1' },
				{ requestManager: eipRequestManager },
			);
			await sub.subscribe();
			// @ts-expect-error spy on protected method
			const processResult = jest.spyOn(sub, '_processSubscriptionResult');
			eipProvider.emit('message', testData);
			expect(processResult).toHaveBeenCalledWith(testData.data);
		});
	});
});
