import { ExampleSubscription } from './fixtures/example_subscription';

describe('Web3Subscription', () => {
	let requestManager: any;
	let sub: ExampleSubscription;

	beforeEach(() => {
		requestManager = {
			send: jest.fn(),
			on: jest.fn(),
			provider: { on: jest.fn(), removeListener: jest.fn() },
		};
		sub = new ExampleSubscription({ param1: 'value' }, { requestManager });
	});

	describe('subscribe', () => {
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
			sub['_id'] = 'sub-id';
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

		it('should remove listener for "message" event', async () => {
			await sub.unsubscribe();

			expect(requestManager.provider.removeListener).toHaveBeenCalledTimes(1);
			expect(requestManager.provider.removeListener).toHaveBeenCalledWith(
				'message',
				undefined,
			);
		});
	});
});
