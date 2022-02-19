import { Web3APISpec } from 'web3-common';
import { Web3ConfigOptions, SupportedProviders } from './types';
import { Web3Config, Web3ConfigEvent } from './web3_config';
import { Web3RequestManager } from './web3_request_manager';
import { Web3SubscriptionConstructor } from './web3_subscriptions';
import { Web3SubscriptionManager } from './web3_subscription_manager';

export type Web3ContextConstructor<
	API extends Web3APISpec,
	RegisteredSubs extends {
		[key: string]: Web3SubscriptionConstructor<API>;
	},
	// eslint-disable-next-line no-use-before-define
	ContextObject extends Web3Context<API, RegisteredSubs> = Web3Context<API, RegisteredSubs>,
> = new (
	provider: SupportedProviders<API> | string,
	options?: Partial<Web3ConfigOptions>,
	registeredSubscriptions?: RegisteredSubs,
) => ContextObject;

export class Web3Context<
	API extends Web3APISpec,
	RegisteredSubs extends {
		[key: string]: Web3SubscriptionConstructor<API>;
	} = {},
> extends Web3Config {
	public static readonly providers = Web3RequestManager.providers;
	public static givenProvider?: SupportedProviders<never>;
	public readonly providers = Web3RequestManager.providers;

	public readonly requestManager: Web3RequestManager<API>;
	public readonly subscriptionManager?: Web3SubscriptionManager<API, RegisteredSubs>;

	public constructor(
		provider: SupportedProviders<API> | string,
		options?: Partial<Web3ConfigOptions>,
		registeredSubscriptions?: RegisteredSubs,
	) {
		super(options);

		this.requestManager = new Web3RequestManager<API>(provider);

		if (registeredSubscriptions) {
			this.subscriptionManager = new Web3SubscriptionManager(
				this.requestManager,
				registeredSubscriptions,
			);
		}
	}

	public static fromContext<Context extends Web3Context<any, any>>(context: Context) {
		const newContext = new Web3Context(context.currentProvider);
		newContext.setConfig(context.getConfig());

		return newContext;
	}

	public use(ContextRef: Web3ContextConstructor<API, RegisteredSubs>) {
		const newContext = new ContextRef(this.currentProvider);

		newContext.setConfig(this.getConfig());

		this.on(Web3ConfigEvent.CONFIG_CHANGE, event => {
			// TODO: Test why it's not assigning the event name
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			newContext[event.name] = event.newValue;
		});

		return newContext;
	}

	public get currentProvider(): SupportedProviders<API> | string {
		return this.requestManager.provider;
	}

	public set currentProvider(provider: SupportedProviders<API> | string) {
		this.requestManager.setProvider(provider);
	}
}
