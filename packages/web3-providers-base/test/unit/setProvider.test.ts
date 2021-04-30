import Web3ProviderBase from '../../src/index'

describe('setProvider', () => {
    const providerOptions = {
        providerString: 'http://127.0.0.1:8545',
        protectProvider: false,
        supportsSubscriptions: false
    }
    const updatedProviderString = 'teststring'

    let web3ProviderBase

    beforeEach(() => {
        web3ProviderBase = new Web3ProviderBase(providerOptions)
    })

    it('should update providerString', () => {
        const web3ProviderBase = new Web3ProviderBase(providerOptions)
        web3ProviderBase.setProvider(updatedProviderString)
        expect(web3ProviderBase).toMatchObject(
            {...providerOptions, providerString: updatedProviderString})
    })

    it('should error because providerOptions.protectProvider = true', () => {
        providerOptions.protectProvider = true
        const web3ProviderBase = new Web3ProviderBase(providerOptions)
        expect(() => web3ProviderBase.setProvider(updatedProviderString))
            .toThrow(`Error setting provider: Provider is protected`)
    })
})
