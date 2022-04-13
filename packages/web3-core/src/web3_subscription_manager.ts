import { ProviderError, SubscriptionError, Web3APISpec } from 'web3-common';
import { isSupportSubscriptions } from './utils';
import { Web3RequestManager, Web3RequestManagerEvent } from './web3_request_manager';
import { Web3SubscriptionConstructor } from './web3_subscriptions';

type ShouldUnsubscribeCondition = ({
	id: sub,
}: {
	id: string;
	sub: unknown;
}) => boolean | undefined;

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

		const Klass: RegisteredSubs[T] = this.registeredSubscriptions[name];
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
		const { id } = sub;
		await sub.unsubscribe();
		this._subscriptions.delete(id);
	}

	public async unsubscribe(condition?: ShouldUnsubscribeCondition) {
		const result = [];
		for (const [id, sub] of this.subscriptions.entries()) {
			if (!condition || (typeof condition === 'function' && condition({ id, sub }))) {
				result.push(this.removeSubscription(sub));
			}
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
