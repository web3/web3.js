import Web3ProviderBase from '../../src/index'

describe('Web3ProviderBase.protectProvider', () => {
    const providerOptions = {
        providerString: 'http://127.0.0.1:8545',
        protectProvider: false,
        supportsSubscriptions: false
    }

    it('should return protectProvider', () => {
        const web3ProviderBase = new Web3ProviderBase(providerOptions)
        expect(web3ProviderBase.protectProvider).toBe(providerOptions.protectProvider)
    })
})
