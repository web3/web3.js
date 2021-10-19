import { InvalidProviderError } from 'web3-common';
import {
	isWeb3Provider,
	Web3RequestManager,
	Web3RequestManagerEvent,
} from './web3_request_manager';
import { Web3Subscription, Web3SubscriptionConstructor } from './web3_subscriptions';

export class Web3SubscriptionManager<
	ST extends { [key: string]: Web3SubscriptionConstructor<Web3Subscription> },
> {
	private readonly _subscriptions: Map<string, Web3Subscription> = new Map();

	public constructor(
		public readonly requestManager: Web3RequestManager,
		public readonly registeredSubscriptions: ST,
	) {
		this.requestManager.on(Web3RequestManagerEvent.BEFORE_PROVIDER_CHANGE, () => {
			// this.unsubscribe();
		});

		this.requestManager.on(Web3RequestManagerEvent.PROVIDER_CHANGED, () => {
			// this.clear();
		});
	}

	public async subscribe<T extends keyof ST>(
		name: T,
		args?: ConstructorParameters<ST[T]>[0],
	): Promise<InstanceType<ST[T]>> {
		if (!this.requestManager.provider) {
			throw new InvalidProviderError('No provider set');
		}

		if (!this.supportsSubscriptions()) {
			throw new Error('The current provider do not support subscriptions');
		}

		const Klass = this.registeredSubscriptions[name];

		const subscription = new Klass(args ?? null, {
			requestManager: this.requestManager,
		}) as InstanceType<ST[T]>;

		await subscription.subscribe();

		if (subscription.id === undefined) {
			throw new Error('Subscription is not subscribed yet.');
		}

		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	public async addSubscription(sub: Web3Subscription) {
		if (sub.id === undefined) {
			throw new Error('Subscription is not subscribed yet.');
		}

		if (this._subscriptions.has(sub.id)) {
			throw new Error(`Subscription with id "${sub.id}" already exists`);
		}

		await sub.subscribe();

		if (sub.id === undefined) {
			throw new Error('Subscription is not subscribed yet.');
		}

		this._subscriptions.set(sub.id, sub);
	}

	public async removeSubscription(sub: Web3Subscription) {
		if (sub.id === undefined) {
			throw new Error('Subscription is not subscribed yet.');
		}

		if (!this._subscriptions.has(sub.id)) {
			throw new Error(`Subscription with id "${sub.id}" does not exists`);
		}

		await sub.unsubscribe();
		this._subscriptions.delete(sub.id);
	}

	public async unsubscribe() {
		const result = [];

		for (const [, sub] of this._subscriptions.entries()) {
			result.push(this.removeSubscription(sub));
		}

		return Promise.all(result);
	}

	public supportsSubscriptions(): boolean {
		if (isWeb3Provider(this.requestManager.provider)) {
			return this.requestManager.provider.supportsSubscriptions();
		}

		// TODO: Add checks for other types later
		return false;
	}
}
