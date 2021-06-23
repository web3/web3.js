import { ProviderOptions } from 'web3-providers-base/lib/types';

import Web3ProvidersHttp from '../../src/index';

describe('Web3ProvidersHttp.supportsSubscriptions', () => {
    const providerOptions: ProviderOptions = {
        providerUrl: 'http://127.0.0.1:8545',
    };

    it('should return true', () => {
        const web3ProvidersHttp = new Web3ProvidersHttp(providerOptions);
        expect(web3ProvidersHttp.supportsSubscriptions()).toBeTruthy();
    });
});
