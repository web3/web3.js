import { Web3APISpec } from 'web3-common';
import { Web3ConfigOptions, SupportedProviders } from './types';
import { Web3Config } from './web3_config';
import { Web3RequestManager } from './web3_request_manager';

export class Web3Context<API extends Web3APISpec> extends Web3Config {
	public static readonly providers = Web3RequestManager.providers;
	public static givenProvider?: SupportedProviders<never>;
	public readonly providers = Web3RequestManager.providers;

	public readonly requestManager: Web3RequestManager<API>;

	public constructor(
		provider: SupportedProviders<API> | string,
		options?: Partial<Web3ConfigOptions>,
	) {
		super();
		this.requestManager = new Web3RequestManager<API>(provider);

		if (options !== undefined) Object.assign(this, options);
	}

	public get currentProvider(): SupportedProviders<API> | string {
		return this.requestManager.provider;
	}

	public set currentProvider(provider: SupportedProviders<API> | string) {
		this.requestManager.setProvider(provider);
	}
}
