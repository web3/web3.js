import { Web3APISpec } from 'web3-common';
import { SupportedProviders, Web3ConfigOptions } from './types';
import { isSupportedProvider } from './utils';
import { Web3Config, Web3ConfigEvent } from './web3_config';
import { Web3RequestManager } from './web3_request_manager';
import { Web3SubscriptionConstructor } from './web3_subscriptions';
import { Web3SubscriptionManager } from './web3_subscription_manager';

// To avoid circular dependencies, we need to export type from here.
export type Web3ContextObject<
	API extends Web3APISpec = any,
	RegisteredSubs extends {
		[key: string]: Web3SubscriptionConstructor<API>;
	} = any,
> = {
	config: Web3ConfigOptions;
	provider: SupportedProviders<API>;
	requestManager: Web3RequestManager<API>;
	subscriptionManager?: Web3SubscriptionManager<API, RegisteredSubs> | undefined;
	registeredSubscriptions?: RegisteredSubs;
	providers: typeof Web3RequestManager.providers;
};

export type Web3ContextConstructor<
	// eslint-disable-next-line no-use-before-define
	T extends Web3Context<any>,
	T2 extends unknown[],
> = new (...args: [...extras: T2, context: Web3ContextObject]) => T;

// To avoid circular dependencies, we need to export type from here.
export type Web3ContextFactory<
	// eslint-disable-next-line no-use-before-define
	T extends Web3Context<any>,
	T2 extends unknown[],
> = Web3ContextConstructor<T, T2> & {
	fromContextObject(this: Web3ContextConstructor<T, T2>, contextObject: Web3ContextObject): T;
};

export class Web3Context<
	API extends Web3APISpec,
	RegisteredSubs extends {
		[key: string]: Web3SubscriptionConstructor<API>;
	} = any,
> extends Web3Config {
	public static readonly providers = Web3RequestManager.providers;
	public static givenProvider?: SupportedProviders<never>;
	public readonly providers = Web3RequestManager.providers;

	public requestManager: Web3RequestManager<API>;
	public subscriptionManager?: Web3SubscriptionManager<API, RegisteredSubs>;

	public constructor(
		providerOrContext:
			| SupportedProviders<API>
			| Partial<Web3ContextObject<API, RegisteredSubs>>,
	) {
		super();

		if (
			typeof providerOrContext === 'string' ||
			isSupportedProvider(providerOrContext as SupportedProviders<API>)
		) {
			this.requestManager = new Web3RequestManager<API>(
				providerOrContext as SupportedProviders<API>,
			);

			return;
		}

		const { config, provider, requestManager, subscriptionManager, registeredSubscriptions } =
			providerOrContext as Partial<Web3ContextObject<API, RegisteredSubs>>;

		this.setConfig(config ?? {});

		this.requestManager = requestManager ?? new Web3RequestManager<API>(provider);

		if (subscriptionManager) {
			this.subscriptionManager = subscriptionManager;
		} else if (registeredSubscriptions) {
			this.subscriptionManager = new Web3SubscriptionManager(
				this.requestManager,
				registeredSubscriptions,
			);
		}
	}

	public static fromContextObject<T extends Web3Context<any>, T3 extends unknown[]>(
		this: Web3ContextConstructor<T, T3>,
		...args: [Web3ContextObject, ...T3]
	) {
		return new this(...(args.reverse() as [...T3, Web3ContextObject]));
	}

	public getContextObject(): Web3ContextObject<API, RegisteredSubs> {
		return {
			config: this.getConfig(),
			provider: this.provider,
			requestManager: this.requestManager,
			subscriptionManager: this.subscriptionManager,
			registeredSubscriptions: this.subscriptionManager
				?.registeredSubscriptions as RegisteredSubs,
			providers: this.providers,
		};
	}

	public use<T extends Web3Context<any>, T2 extends unknown[]>(
		ContextRef: Web3ContextConstructor<T, T2>,
		...args: [...T2]
	) {
		const newContextChild: T = new ContextRef(
			...([...args, this.getContextObject()] as unknown as [...T2, Web3ContextObject]),
		);

		this.on(Web3ConfigEvent.CONFIG_CHANGE, event => {
			// TODO: Test why it's not assigning the event name
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			newContextChild[event.name] = event.newValue;
		});

		return newContextChild;
	}

	public linkTo<T extends Web3Context<API, RegisteredSubs>>(parentContext: T) {
		this.setConfig(parentContext.getConfig());
		this.requestManager = parentContext.requestManager;
		this.provider = parentContext.provider;
		this.subscriptionManager = parentContext.subscriptionManager;

		parentContext.on(Web3ConfigEvent.CONFIG_CHANGE, event => {
			// TODO: Test why it's not assigning the event name
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			this[event.name] = event.newValue;
		});
	}

	public get provider(): SupportedProviders<API> {
		return this.requestManager.provider;
	}

	public set provider(provider: SupportedProviders<API>) {
		this.requestManager.setProvider(provider);
	}

	public get currentProvider(): SupportedProviders<API> {
		return this.requestManager.provider;
	}

	public set currentProvider(provider: SupportedProviders<API>) {
		this.requestManager.setProvider(provider);
	}
}
