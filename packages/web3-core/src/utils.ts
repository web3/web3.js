import { Web3BaseProvider } from 'web3-common';
import {
	LegacyRequestProvider,
	LegacySendAsyncProvider,
	LegacySendProvider,
	SupportedProviders,
} from './types';

export const isWeb3Provider = (provider: SupportedProviders): provider is Web3BaseProvider =>
	Web3BaseProvider.isWeb3Provider(provider);

export const isLegacyRequestProvider = (
	provider: SupportedProviders,
): provider is LegacyRequestProvider => 'request' in provider;

export const isLegacySendProvider = (
	provider: SupportedProviders,
): provider is LegacySendProvider => 'send' in provider;

export const isLegacySendAsyncProvider = (
	provider: SupportedProviders,
): provider is LegacySendAsyncProvider => 'sendAsync' in provider;

export const isSupportSubscriptions = (provider: SupportedProviders): boolean => {
	if (isWeb3Provider(provider)) {
		return provider.supportsSubscriptions();
	}

	if ('on' in provider) {
		return true;
	}

	return false;
};
