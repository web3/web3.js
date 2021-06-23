import { ProviderOptions } from 'web3-providers-base/lib/types';

import Web3ProvidersHttp from '../../src/index';

describe('Web3ProvidersHttp.setProvider', () => {
    let providerOptions: ProviderOptions;

    beforeEach(() => {
        providerOptions = {
            providerUrl: 'http://127.0.0.1:8545',
        };
    });

    it('should update the provider with updatedProviderUrl', () => {
        const updatedProviderUrl = 'http://foo.bar';
        const web3ProvidersHttp = new Web3ProvidersHttp(providerOptions);
        web3ProvidersHttp.setProvider(updatedProviderUrl);
        expect(web3ProvidersHttp.providerUrl).toBe(updatedProviderUrl);
    });

    it('should update the provider with updatedProviderUrl', () => {
        const updatedProviderUrl = 'http://localhost:8545';
        const web3ProvidersHttp = new Web3ProvidersHttp(providerOptions);
        web3ProvidersHttp.setProvider(updatedProviderUrl);
        expect(web3ProvidersHttp.providerUrl).toBe(updatedProviderUrl);
    });

    it('should update the provider with updatedProviderUrl', () => {
        const updatedProviderUrl = 'https://foo.bar';
        const web3ProvidersHttp = new Web3ProvidersHttp(providerOptions);
        web3ProvidersHttp.setProvider(updatedProviderUrl);
        expect(web3ProvidersHttp.providerUrl).toBe(updatedProviderUrl);
    });

    it('should update the provider with updatedProviderUrl', () => {
        const updatedProviderUrl = 'https://localhost:8545';
        const web3ProvidersHttp = new Web3ProvidersHttp(providerOptions);
        web3ProvidersHttp.setProvider(updatedProviderUrl);
        expect(web3ProvidersHttp.providerUrl).toBe(updatedProviderUrl);
    });

    it('should error because provider string is invalid', () => {
        const updatedProviderUrl = 'foobar';
        const web3ProvidersHttp = new Web3ProvidersHttp(providerOptions);
        expect(() => {
            web3ProvidersHttp.setProvider(updatedProviderUrl);
        }).toThrowError(
            'Failed to set provider: Failed to create HTTP client: Invalid HTTP(S) URL provided'
        );
    });

    it('should error because provider string is invalid', () => {
        const updatedProviderUrl = 'email@foo.com';
        const web3ProvidersHttp = new Web3ProvidersHttp(providerOptions);
        expect(() => {
            web3ProvidersHttp.setProvider(updatedProviderUrl);
        }).toThrowError(
            'Failed to set provider: Failed to create HTTP client: Invalid HTTP(S) URL provided'
        );
    });

    it('should error because provider string is invalid', () => {
        const updatedProviderUrl = 'htp://localhost';
        const web3ProvidersHttp = new Web3ProvidersHttp(providerOptions);
        expect(() => {
            web3ProvidersHttp.setProvider(updatedProviderUrl);
        }).toThrowError(
            'Failed to set provider: Failed to create HTTP client: Invalid HTTP(S) URL provided'
        );
    });

    it('should error because provider string is invalid', () => {
        const updatedProviderUrl = 'foo.bar';
        const web3ProvidersHttp = new Web3ProvidersHttp(providerOptions);
        expect(() => {
            web3ProvidersHttp.setProvider(updatedProviderUrl);
        }).toThrowError(
            'Failed to set provider: Failed to create HTTP client: Invalid HTTP(S) URL provided'
        );
    });

    it('should error because provider string is invalid', () => {
        const updatedProviderUrl = 'foo.bar:8545';
        const web3ProvidersHttp = new Web3ProvidersHttp(providerOptions);
        expect(() => {
            web3ProvidersHttp.setProvider(updatedProviderUrl);
        }).toThrowError(
            'Failed to set provider: Failed to create HTTP client: Invalid HTTP(S) URL provided'
        );
    });
});
