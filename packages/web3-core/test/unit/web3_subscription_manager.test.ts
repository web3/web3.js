import { Web3RequestManagerEvent } from '../../src/web3_request_manager';
import { Web3SubscriptionManager } from '../../src/web3_subscription_manager';
import { ExampleSubscription } from './fixtures/example_subscription';

jest.mock('./fixtures/example_subscription');

const subscriptions = { example: ExampleSubscription };

describe('Web3SubscriptionManager', () => {
	let requestManager: any;

	beforeEach(() => {
		requestManager = { send: jest.fn(), on: jest.fn(), provider: jest.fn() };
		(ExampleSubscription as jest.Mock).mockClear();
	});

	describe('constructor', () => {
		it('should create subscription manager object', () => {
			const subManager = new Web3SubscriptionManager(requestManager, {});
			expect(subManager).toBeInstanceOf(Web3SubscriptionManager);
		});

		it('should create register events for request manager', () => {
			const subManager = new Web3SubscriptionManager(requestManager, {});

			expect(subManager).not.toBeUndefined();
			expect(requestManager.on).toHaveBeenCalledTimes(2);
			expect(requestManager.on).toHaveBeenCalledWith(
				Web3RequestManagerEvent.BEFORE_PROVIDER_CHANGE,
				expect.any(Function),
			);
			expect(requestManager.on).toHaveBeenCalledWith(
				Web3RequestManagerEvent.PROVIDER_CHANGED,
				expect.any(Function),
			);
		});

		it('should register the subscription types', () => {
			const subManager = new Web3SubscriptionManager(requestManager, {
				example: ExampleSubscription,
			});

			expect(subManager.registeredSubscriptions).toEqual(subscriptions);
		});
	});

	describe('subscribe', () => {
		let subManager: Web3SubscriptionManager<any>;

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
				'The current provider do not support subscriptions',
			);
		});

		it('should throw error if invalid subscription type is called', async () => {
			await expect(subManager.subscribe('example2')).rejects.toThrow(
				'Invalid subscription type',
			);
		});

		it('should return valid subscription type if subscribed', async () => {
			jest.spyOn(subManager, 'addSubscription').mockResolvedValue();
			const result = await subManager.subscribe('example');

			expect(result).toBeInstanceOf(ExampleSubscription);
		});

		it('should initialize subscription with valid args', async () => {
			jest.spyOn(subManager, 'addSubscription').mockResolvedValue();
			const result = await subManager.subscribe('example', { test1: 'test1' });

			expect(result).toBeInstanceOf(ExampleSubscription);
			expect(ExampleSubscription).toHaveBeenCalledTimes(1);
			expect(ExampleSubscription).toHaveBeenCalledWith(
				{ test1: 'test1' },
				{ requestManager },
			);
		});
	});

	describe('addSubscription', () => {
		let subManager: Web3SubscriptionManager<any>;
		let sub: ExampleSubscription;

		beforeEach(() => {
			subManager = new Web3SubscriptionManager(requestManager, subscriptions);
			jest.spyOn(subManager, 'supportsSubscriptions').mockReturnValue(true);
			sub = new ExampleSubscription({ param1: 'param1' }, { requestManager });

			(sub as any).id = '123';
		});

		it('should throw error if a subscription already exists with same id', async () => {
			await subManager.addSubscription(sub);

			await expect(subManager.addSubscription(sub)).rejects.toThrow(
				'Subscription with id "123" already exists',
			);
		});

		it('should try to subscribe the subscription', async () => {
			await subManager.addSubscription(sub);

			expect(sub.subscribe).toHaveBeenCalledTimes(1);
			expect(sub.subscribe).toHaveBeenCalledWith();
		});

		it('should set the subscription to the map', async () => {
			expect(subManager.subscriptions).toEqual(new Map());

			await subManager.addSubscription(sub);

			expect(subManager.subscriptions).toEqual(new Map([['123', sub]]));
		});
	});

	describe('removeSubscription', () => {
		let subManager: Web3SubscriptionManager<any>;
		let sub: ExampleSubscription;

		beforeEach(async () => {
			subManager = new Web3SubscriptionManager(requestManager, subscriptions);
			jest.spyOn(subManager, 'supportsSubscriptions').mockReturnValue(true);
			sub = new ExampleSubscription({ param1: 'param1' }, { requestManager });

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

		it('should try to unsubscribe the subscription', async () => {
			await subManager.removeSubscription(sub);

			expect(sub.unsubscribe).toHaveBeenCalledTimes(1);
			expect(sub.unsubscribe).toHaveBeenCalledWith();
		});

		it('should remove the subscription to the map', async () => {
			expect(subManager.subscriptions).toEqual(new Map([['123', sub]]));

			await subManager.removeSubscription(sub);

			expect(subManager.subscriptions).toEqual(new Map());
		});
	});
});
