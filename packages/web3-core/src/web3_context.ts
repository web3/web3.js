import { SupportedProviders } from './types';
import { Web3RequestManager } from './web3_request_manager';
import { Web3Config } from './web3_config';

export class Web3Context extends Web3Config {
	public static readonly providers = Web3RequestManager.providers;
	public static givenProvider?: SupportedProviders | string;
	public readonly providers = Web3RequestManager.providers;

	public readonly requestManager: Web3RequestManager;

	public constructor(provider: SupportedProviders | string) {
		super();
		this.requestManager = new Web3RequestManager(provider);
	}

	public get currentProvider(): SupportedProviders | string {
		return this.requestManager.provider;
	}

	public set currentProvider(provider: SupportedProviders | string) {
		this.requestManager.setProvider(provider);
	}
}
