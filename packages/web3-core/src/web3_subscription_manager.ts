import { ProviderError, SubscriptionError, Web3APISpec } from 'web3-common';
import { isSupportSubscriptions } from './utils';
import { Web3RequestManager, Web3RequestManagerEvent } from './web3_request_manager';
import { Web3SubscriptionConstructor } from './web3_subscriptions';

export class Web3SubscriptionManager<
	API extends Web3APISpec,
	RegisteredSubs extends { [key: string]: Web3SubscriptionConstructor<API> },
> {
	private readonly _subscriptions: Map<
		string,
		InstanceType<RegisteredSubs[keyof RegisteredSubs]>
	> = new Map();

	public constructor(
		public readonly requestManager: Web3RequestManager<API>,
		public readonly registeredSubscriptions: RegisteredSubs,
	) {
		this.requestManager.on(Web3RequestManagerEvent.BEFORE_PROVIDER_CHANGE, async () => {
			await this.unsubscribe();
		});

		this.requestManager.on(Web3RequestManagerEvent.PROVIDER_CHANGED, () => {
			this.clear();
		});
	}

	public async subscribe<T extends keyof RegisteredSubs>(
		name: T,
		args?: ConstructorParameters<RegisteredSubs[T]>[0],
	): Promise<InstanceType<RegisteredSubs[T]>> {
		if (!this.requestManager.provider) {
			throw new ProviderError('Provider not available');
		}

		const Klass = this.registeredSubscriptions[name];

		if (!Klass) {
			throw new SubscriptionError('Invalid subscription type');
		}

		const subscription = new Klass(args ?? null, {
			requestManager: this.requestManager,
		}) as InstanceType<RegisteredSubs[T]>;

		await this.addSubscription(subscription);

		return subscription;
	}

	public get subscriptions() {
		return this._subscriptions;
	}

	public async addSubscription(sub: InstanceType<RegisteredSubs[keyof RegisteredSubs]>) {
		if (!this.supportsSubscriptions()) {
			throw new SubscriptionError('The current provider does not support subscriptions');
		}

		if (sub.id && this._subscriptions.has(sub.id)) {
			throw new SubscriptionError(`Subscription with id "${sub.id}" already exists`);
		}

		await sub.subscribe();

		if (sub.id === undefined) {
			throw new SubscriptionError('Subscription is not subscribed yet.');
		}

		this._subscriptions.set(sub.id, sub);
	}

	public async removeSubscription(sub: InstanceType<RegisteredSubs[keyof RegisteredSubs]>) {
		if (sub.id === undefined) {
			throw new SubscriptionError('Subscription is not subscribed yet.');
		}

		if (!this._subscriptions.has(sub.id)) {
			throw new SubscriptionError(`Subscription with id "${sub.id}" does not exists`);
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

	public clear() {
		this._subscriptions.clear();
	}

	public supportsSubscriptions(): boolean {
		return isSupportSubscriptions(this.requestManager.provider);
	}
}
