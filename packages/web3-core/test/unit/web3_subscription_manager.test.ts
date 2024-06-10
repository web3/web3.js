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

import { DEFAULT_RETURN_FORMAT } from 'web3-types';
import { Web3RequestManagerEvent } from '../../src/web3_request_manager';
import { Web3SubscriptionManager } from '../../src/web3_subscription_manager';
import { ExampleSubscription } from './fixtures/example_subscription';

jest.mock('./fixtures/example_subscription');

const subscriptions = { example: ExampleSubscription as never };

describe('Web3SubscriptionManager', () => {
	let requestManager: any;
	let subManager: Web3SubscriptionManager<any, any>;

	beforeEach(() => {
		requestManager = {
			send: jest.fn().mockImplementation(async () => {
				return 'sub-id';
			}),
			on: jest.fn(),
			provider: { on: jest.fn() },
		};
		subManager = new Web3SubscriptionManager(requestManager, subscriptions);
		(ExampleSubscription as jest.Mock).mockClear();
	});

	describe('constructor', () => {
		it('should create subscription manager object', () => {
			subManager = new Web3SubscriptionManager(requestManager, {});
			expect(subManager).toBeInstanceOf(Web3SubscriptionManager);
		});

		it('should create register events for request manager', () => {
			const requestMan: any = {
				send: jest.fn(),
				on: jest.fn(),
				provider: {
					on: jest
						.fn()
						.mockImplementation((_: string, callback: (a: string) => unknown) =>
							callback('something'),
						),
				},
			};
			const subscriptionMan = new Web3SubscriptionManager(requestMan, {});

			expect(subscriptionMan).toBeDefined();
			expect(requestMan.on).toHaveBeenCalledTimes(2);
			expect(requestMan.on).toHaveBeenCalledWith(
				Web3RequestManagerEvent.BEFORE_PROVIDER_CHANGE,
				expect.any(Function),
			);
			expect(requestMan.on).toHaveBeenCalledWith(
				Web3RequestManagerEvent.PROVIDER_CHANGED,
				expect.any(Function),
			);
		});
		it('should register the subscription types', () => {
			subManager = new Web3SubscriptionManager(requestManager, {
				example: ExampleSubscription as never,
			});

			expect(subManager.registeredSubscriptions).toEqual(subscriptions);
		});
	});

	describe('subscribe', () => {
		beforeEach(() => {
			subManager = new Web3SubscriptionManager(requestManager, subscriptions);

			jest.spyOn(subManager, 'supportsSubscriptions').mockReturnValue(true);
		});

		it('should throw error if current provider not available', async () => {
			delete requestManager.provider;
			jest.spyOn(subManager, 'supportsSubscriptions').mockReturnValue(false);

			await expect(subManager.subscribe('example')).rejects.toThrow('Provider not available');
		});

		it('should throw error if subscription is not supported', async () => {
			jest.spyOn(subManager, 'supportsSubscriptions').mockReturnValue(false);

			await expect(subManager.subscribe('example')).rejects.toThrow(
				'The current provider does not support subscriptions',
			);
		});

		it('should throw error if invalid subscription type is called', async () => {
			await expect(subManager.subscribe('example2')).rejects.toThrow(
				'Invalid subscription type',
			);
		});

		it('should return valid subscription type if subscribed', async () => {
			jest.spyOn(subManager, 'addSubscription').mockResolvedValue('123');
			const result = await subManager.subscribe('example');

			expect(result).toBeInstanceOf(ExampleSubscription);
		});

		it('should initialize subscription with valid args', async () => {
			jest.spyOn(subManager, 'addSubscription').mockResolvedValue('456');
			const result = await subManager.subscribe('example', { test1: 'test1' });

			expect(result).toBeInstanceOf(ExampleSubscription);
			expect(ExampleSubscription).toHaveBeenCalledTimes(1);
			expect(ExampleSubscription).toHaveBeenCalledWith(
				{ test1: 'test1' },
				{ subscriptionManager: subManager, returnFormat: DEFAULT_RETURN_FORMAT },
			);
		});
	});

	describe('addSubscription', () => {
		let sub: ExampleSubscription;

		beforeEach(() => {
			subManager = new Web3SubscriptionManager(requestManager, subscriptions);
			jest.spyOn(subManager, 'supportsSubscriptions').mockReturnValue(true);
			sub = new ExampleSubscription(
				{ param1: 'param1' },
				{ subscriptionManager: subManager },
			);

			(sub as any).id = '123';
		});

		it('should throw error if a subscription already exists with same id', async () => {
			await subManager.addSubscription(sub);

			await expect(subManager.addSubscription(sub)).rejects.toThrow(
				'Subscription with id "123" already exists',
			);
		});
		it('should error when there is no sub id', async () => {
			(sub as any).id = undefined;
			// const subManagers = new Web3SubscriptionManager(requestManager, subscriptions) as any
			// // eslint-disable-next-line @typescript-eslint/no-unsafe-call
			await expect(subManager.addSubscription(sub)).rejects.toThrow();
		});

		it('should try to subscribe the subscription', async () => {
			sub = new ExampleSubscription(
				{ param1: 'param1' },
				{ subscriptionManager: subManager },
			);
			jest.spyOn(sub, 'sendSubscriptionRequest').mockImplementation(async () => {
				(sub as any).id = 'value';
				return Promise.resolve(sub.id as string);
			});
			await subManager.addSubscription(sub);

			expect(sub.sendSubscriptionRequest).toHaveBeenCalledTimes(1);
			expect(sub.sendSubscriptionRequest).toHaveBeenCalledWith();
		});

		it('should set the subscription to the map', async () => {
			expect(subManager.subscriptions).toEqual(new Map());

			await subManager.addSubscription(sub);

			expect(subManager.subscriptions).toEqual(new Map([['123', sub]]));
		});
	});

	describe('removeSubscription', () => {
		let sub: ExampleSubscription;

		beforeEach(async () => {
			subManager = new Web3SubscriptionManager(requestManager, subscriptions);
			jest.spyOn(subManager, 'supportsSubscriptions').mockReturnValue(true);
			sub = new ExampleSubscription(
				{ param1: 'param1' },
				{ subscriptionManager: subManager },
			);

			(sub as any).id = '123';
			await subManager.addSubscription(sub);
		});

		it('should throw error if a subscription id does not exists', async () => {
			delete (sub as any).id;

			await expect(subManager.removeSubscription(sub)).rejects.toThrow(
				'Subscription is not subscribed yet.',
			);
		});

		it('should throw error if a subscription does not exists', async () => {
			(sub as any).id = '456';

			await expect(subManager.removeSubscription(sub)).rejects.toThrow(
				'Subscription with id "456" does not exists',
			);
		});

		it('should unsubscribe to the subscription by id', async () => {
			await subManager.unsubscribe(({ id }) => {
				if (id === '123') {
					return true;
				}
				return false;
			});

			expect(subManager.subscriptions).toEqual(new Map());
		});

		it('should unsubscribe in the subscription under the condition', async () => {
			await subManager.removeSubscription(sub);

			expect(sub.sendUnsubscribeRequest).toHaveBeenCalledTimes(1);
			expect(sub.sendUnsubscribeRequest).toHaveBeenCalledWith();
		});

		it('should remove the subscription to the map', async () => {
			expect(subManager.subscriptions).toEqual(new Map([['123', sub]]));

			await subManager.removeSubscription(sub);

			expect(subManager.subscriptions).toEqual(new Map());
		});
	});
	describe('messageListener', () => {
		let subscription: ExampleSubscription;

		beforeEach(() => {
			subManager = new Web3SubscriptionManager(requestManager, subscriptions);
			jest.spyOn(subManager, 'supportsSubscriptions').mockReturnValue(true);
			subscription = new ExampleSubscription(
				{ param1: 'param1' },
				{ subscriptionManager: subManager },
			);
			(subscription as any).id = '123';
		});

		afterEach(() => {
			jest.clearAllMocks();
		});
		it('should error when no data is provided', () => {
			const subManagers = new Web3SubscriptionManager(requestManager, subscriptions) as any;
			expect(() => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				subManagers.messageListener();
			}).toThrow();
		});
	});
});
