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

import { DataFormat, DEFAULT_RETURN_FORMAT, Web3APISpec } from 'web3-types';
import { ProviderError, SubscriptionError } from 'web3-errors';
import { isNullish } from 'web3-utils';
import { isSupportSubscriptions } from './utils.js';
import { Web3RequestManager, Web3RequestManagerEvent } from './web3_request_manager.js';
import { Web3SubscriptionConstructor } from './web3_subscriptions.js';

type ShouldUnsubscribeCondition = ({
	id,
	sub,
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

	/**
	 *
	 * @param requestManager
	 * @param registeredSubscriptions
	 *
	 * @example
	 * ```ts
	 * const requestManager = new Web3RequestManager("ws://localhost:8545");
	 * const subscriptionManager = new Web3SubscriptionManager(requestManager, {});
	 * ```
	 */
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

	/**
	 * Will create a new subscription
	 *
	 * @param name - The subscription you want to subscribe to
	 * @param args (optional) - Optional additional parameters, depending on the subscription type
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
	 *
	 * Will subscribe to a specific topic (note: name)
	 * @returns The subscription object
	 */
	public async subscribe<T extends keyof RegisteredSubs>(
		name: T,
		args?: ConstructorParameters<RegisteredSubs[T]>[0],
		returnFormat: DataFormat = DEFAULT_RETURN_FORMAT,
	): Promise<InstanceType<RegisteredSubs[T]>> {
		if (!this.requestManager.provider) {
			throw new ProviderError('Provider not available');
		}

		const Klass: RegisteredSubs[T] = this.registeredSubscriptions[name];
		if (!Klass) {
			throw new SubscriptionError('Invalid subscription type');
		}

		const subscription = new Klass(args ?? undefined, {
			requestManager: this.requestManager,
			returnFormat,
		}) as InstanceType<RegisteredSubs[T]>;

		await this.addSubscription(subscription);

		return subscription;
	}

	/**
	 * Will returns all subscriptions.
	 */
	public get subscriptions() {
		return this._subscriptions;
	}

	/**
	 *
	 * Adds an instance of {@link Web3Subscription} and subscribes to it
	 *
	 * @param sub - A {@link Web3Subscription} object
	 */
	public async addSubscription(sub: InstanceType<RegisteredSubs[keyof RegisteredSubs]>) {
		if (!this.supportsSubscriptions()) {
			throw new SubscriptionError('The current provider does not support subscriptions');
		}

		if (sub.id && this._subscriptions.has(sub.id)) {
			throw new SubscriptionError(`Subscription with id "${sub.id}" already exists`);
		}

		await sub.subscribe();

		if (isNullish(sub.id)) {
			throw new SubscriptionError('Subscription is not subscribed yet.');
		}

		this._subscriptions.set(sub.id, sub);
	}
	/**
	 * Will clear a subscription
	 *
	 * @param id - The subscription of type {@link Web3Subscription}  to remove
	 */

	public async removeSubscription(sub: InstanceType<RegisteredSubs[keyof RegisteredSubs]>) {
		if (isNullish(sub.id)) {
			throw new SubscriptionError(
				'Subscription is not subscribed yet. Or, had already been unsubscribed but not through the Subscription Manager.',
			);
		}

		if (!this._subscriptions.has(sub.id)) {
			throw new SubscriptionError(
				`Subscription with id "${sub.id.toString()}" does not exists`,
			);
		}
		const { id } = sub;
		await sub.unsubscribe();
		this._subscriptions.delete(id);
		return id;
	}
	/**
	 * Will unsubscribe all subscriptions that fulfill the condition
	 *
	 * @param condition - A function that access and `id` and a `subscription` and return `true` or `false`
	 * @returns An array of all the un-subscribed subscriptions
	 */
	public async unsubscribe(condition?: ShouldUnsubscribeCondition) {
		const result = [];
		for (const [id, sub] of this.subscriptions.entries()) {
			if (!condition || (typeof condition === 'function' && condition({ id, sub }))) {
				result.push(this.removeSubscription(sub));
			}
		}

		return Promise.all(result);
	}

	/**
	 * Clears all subscriptions
	 */
	public clear() {
		this._subscriptions.clear();
	}

	/**
	 * Check whether the current provider supports subscriptions.
	 *
	 * @returns `true` or `false` depending on if the current provider supports subscriptions
	 */
	public supportsSubscriptions(): boolean {
		return isNullish(this.requestManager.provider)
			? false
			: isSupportSubscriptions(this.requestManager.provider);
	}
}
