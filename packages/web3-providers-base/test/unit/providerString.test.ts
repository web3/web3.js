import Web3ProviderBase from '../../src/index'

describe('Web3ProviderBase.providerString', () => {
    const providerOptions = {
        providerString: 'http://127.0.0.1:8545',
        protectProvider: false,
        supportsSubscriptions: false
    }
    const updatedProviderString = 'teststring'

    it('should return providerString', () => {
        const web3ProviderBase = new Web3ProviderBase(providerOptions)
        expect(web3ProviderBase.providerString).toBe(providerOptions.providerString)
    })

    it('should update providerString', () => {
        const web3ProviderBase = new Web3ProviderBase(providerOptions)
        web3ProviderBase.providerString = updatedProviderString
        expect(web3ProviderBase.providerString).toBe(updatedProviderString)
    })
})
