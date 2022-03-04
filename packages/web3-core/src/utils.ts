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
): provider is LegacyRequestProvider => typeof provider !== 'string' && 'request' in provider;

export const isLegacySendProvider = <API extends Web3APISpec>(
	provider: SupportedProviders<API>,
): provider is LegacySendProvider => typeof provider !== 'string' && 'send' in provider;

export const isLegacySendAsyncProvider = <API extends Web3APISpec>(
	provider: SupportedProviders<API>,
): provider is LegacySendAsyncProvider => typeof provider !== 'string' && 'sendAsync' in provider;

export const isSupportedProvider = <API extends Web3APISpec>(
	provider: SupportedProviders<API>,
): boolean =>
	Web3BaseProvider.isWeb3Provider(provider) ||
	isLegacyRequestProvider(provider) ||
	isLegacySendAsyncProvider(provider) ||
	isLegacySendProvider(provider);

export const isSupportSubscriptions = <API extends Web3APISpec>(
	provider: SupportedProviders<API>,
): boolean => {
	if (isWeb3Provider<API>(provider)) {
		return provider.supportsSubscriptions();
	}

	if (typeof provider !== 'string' && 'on' in provider) {
		return true;
	}

	return false;
};
