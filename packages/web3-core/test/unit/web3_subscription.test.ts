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

import { Web3SubscriptionManager } from '../../src';
import { ExampleSubscription } from './fixtures/example_subscription';

const subscriptions = { example: ExampleSubscription as never };

describe('Web3Subscription', () => {
	let requestManager: any;
	let subscriptionManager: Web3SubscriptionManager<any, any>;
	let sub: ExampleSubscription;

	beforeEach(() => {
		requestManager = {
			send: jest.fn().mockImplementation(async () => {
				return 'sub-id';
			}),
			on: jest.fn(),
			provider: { on: jest.fn(), removeListener: jest.fn(), request: jest.fn() },
		};
		subscriptionManager = new Web3SubscriptionManager(requestManager, subscriptions);
	});

	describe('subscriptionManager', () => {
		it('subscriptionManager is accessible in inherited subscription', async () => {
			class InheritedExampleSubscription extends ExampleSubscription {
				public verifyAccessToSubscriptionManager(
					originalSubscriptionManager: Web3SubscriptionManager,
				) {
					expect(this.subscriptionManager).toBe(originalSubscriptionManager);
				}
			}
			new InheritedExampleSubscription(
				{ param1: 'value' },
				{ subscriptionManager },
			).verifyAccessToSubscriptionManager(subscriptionManager);
		});
	});

	describe('subscribe', () => {
		beforeEach(() => {
			sub = new ExampleSubscription({ param1: 'value' }, { subscriptionManager });
		});
		it('should invoke request manager for subscription', async () => {
			await sub.subscribe();

			expect(requestManager.send).toHaveBeenCalledTimes(1);
			expect(requestManager.send).toHaveBeenCalledWith({
				method: 'eth_subscribe',
				params: ['newHeads'],
			});
		});

		it('should set correct subscription id', async () => {
			expect(sub.id).toBeUndefined();
			await sub.subscribe();
			expect(sub.id).toBe('sub-id');
		});

		it('should start listening to the "message" event', async () => {
			await sub.subscribe();

			expect(requestManager.provider.on).toHaveBeenCalledTimes(1);
			expect(requestManager.provider.on).toHaveBeenCalledWith(
				'message',
				expect.any(Function),
			);
		});
	});

	describe('unsubscribe', () => {
		beforeEach(() => {
			sub = new ExampleSubscription({ param1: 'value' }, { subscriptionManager });
			sub['_id'] = 'sub-id';
			subscriptionManager.subscriptions.set('sub-id', sub);
		});

		it('should invoke request manager to unsubscribe', async () => {
			await sub.unsubscribe();

			expect(requestManager.send).toHaveBeenCalledTimes(1);
			expect(requestManager.send).toHaveBeenCalledWith({
				method: 'eth_unsubscribe',
				params: ['sub-id'],
			});
		});

		it('should remove the subscription id', async () => {
			expect(sub.id).toBe('sub-id');
			await sub.unsubscribe();
			expect(sub.id).toBeUndefined();
		});
	});
});

describe('Web3Subscription without subscription manager - (deprecated)', () => {
	let requestManager: any;
	let sub: ExampleSubscription;

	beforeEach(() => {
		requestManager = {
			send: jest.fn().mockImplementation(async () => {
				return 'sub-id';
			}),
			on: jest.fn(),
			provider: { on: jest.fn(), removeListener: jest.fn(), request: jest.fn() },
		};
	});
	describe('subscribe', () => {
		beforeEach(() => {
			// eslint-disable-next-line deprecation/deprecation
			sub = new ExampleSubscription({ param1: 'value' }, { requestManager });
		});

		it('should invoke request manager for subscription', async () => {
			(requestManager.send as jest.Mock).mockResolvedValue('sub-id');
			await sub.subscribe();

			expect(requestManager.send).toHaveBeenCalledTimes(1);
			expect(requestManager.send).toHaveBeenCalledWith({
				method: 'eth_subscribe',
				params: ['newHeads'],
			});
		});

		it('should set correct subscription id', async () => {
			(requestManager.send as jest.Mock).mockResolvedValue('sub-id');

			expect(sub.id).toBeUndefined();
			await sub.subscribe();
			expect(sub.id).toBe('sub-id');
		});

		it('should start listening to the "message" event', async () => {
			// requestManager.provider.on.mockClear();
			await sub.subscribe();

			expect(requestManager.provider.on).toHaveBeenCalledTimes(1);
			expect(requestManager.provider.on).toHaveBeenCalledWith(
				'message',
				expect.any(Function),
			);
		});
	});

	describe('unsubscribe', () => {
		beforeEach(() => {
			// eslint-disable-next-line deprecation/deprecation
			sub = new ExampleSubscription({ param1: 'value' }, { requestManager });
			sub['_id'] = 'sub-id';
		});

		it('should invoke request manager to unsubscribe', async () => {
			await sub.unsubscribe();

			expect(requestManager.provider.on).toHaveBeenCalledTimes(1);
			expect(requestManager.provider.on).toHaveBeenCalledWith(
				'message',
				expect.any(Function),
			);
		});

		it('should remove the subscription id', async () => {
			expect(sub.id).toBe('sub-id');
			await sub.unsubscribe();
			expect(sub.id).toBeUndefined();
		});
	});
});
