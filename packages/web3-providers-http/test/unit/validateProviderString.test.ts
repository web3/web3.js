import Web3ProvidersHttp from '../../src/index';

describe('Web3ProvidersHttp.validateProviderUrl', () => {
    it('should return true', () => {
        const providerUrl = 'http://localhost:8545';
        expect(Web3ProvidersHttp.validateProviderUrl(providerUrl)).toBe(true);
    });

    it('should return true', () => {
        const providerUrl = 'http://localhost';
        expect(Web3ProvidersHttp.validateProviderUrl(providerUrl)).toBe(true);
    });

    it('should return true', () => {
        const providerUrl = 'http://localhost.com';
        expect(Web3ProvidersHttp.validateProviderUrl(providerUrl)).toBe(true);
    });

    it('should return true', () => {
        const providerUrl = 'https://localhost';
        expect(Web3ProvidersHttp.validateProviderUrl(providerUrl)).toBe(true);
    });

    it('should return false', () => {
        const providerUrl = 'localhost.com';
        expect(Web3ProvidersHttp.validateProviderUrl(providerUrl)).toBe(false);
    });

    it('should return false', () => {
        const providerUrl = 'email@foo.com';
        expect(Web3ProvidersHttp.validateProviderUrl(providerUrl)).toBe(false);
    });

    it('should return false', () => {
        const providerUrl = 'htp://localhost';
        expect(Web3ProvidersHttp.validateProviderUrl(providerUrl)).toBe(false);
    });
});
