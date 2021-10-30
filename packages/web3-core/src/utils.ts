import { Web3APISpec, Web3BaseProvider } from 'web3-common';
import {
	LegacyRequestProvider,
	LegacySendAsyncProvider,
	LegacySendProvider,
	SupportedProviders,
} from './types';

export const isWeb3Provider = <API extends Web3APISpec>(
	provider: SupportedProviders<API>,
): provider is Web3BaseProvider<API> => Web3BaseProvider.isWeb3Provider(provider);

export const isLegacyRequestProvider = <API extends Web3APISpec>(
	provider: SupportedProviders<API>,
): provider is LegacyRequestProvider => 'request' in provider;

export const isLegacySendProvider = <API extends Web3APISpec>(
	provider: SupportedProviders<API>,
): provider is LegacySendProvider => 'send' in provider;

export const isLegacySendAsyncProvider = <API extends Web3APISpec>(
	provider: SupportedProviders<API>,
): provider is LegacySendAsyncProvider => 'sendAsync' in provider;

export const isSupportSubscriptions = <API extends Web3APISpec>(
	provider: SupportedProviders<API>,
): boolean => {
	if (isWeb3Provider<API>(provider)) {
		return provider.supportsSubscriptions();
	}

	if ('on' in provider) {
		return true;
	}

	return false;
};
