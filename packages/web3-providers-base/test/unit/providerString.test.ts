import Web3ProviderBase from '../../src/index'

describe('Web3ProviderBase.providerUrl', () => {
    const providerOptions = {
        providerUrl: 'http://127.0.0.1:8545'
    }
    const updatedProviderUrl = 'teststring'

    it('should return providerUrl', () => {
        const web3ProviderBase = new Web3ProviderBase(providerOptions)
        expect(web3ProviderBase.providerUrl).toBe(providerOptions.providerUrl)
    })

    it('should update providerUrl', () => {
        const web3ProviderBase = new Web3ProviderBase(providerOptions)
        web3ProviderBase.providerUrl = updatedProviderUrl
        expect(web3ProviderBase.providerUrl).toBe(updatedProviderUrl)
    })
})
