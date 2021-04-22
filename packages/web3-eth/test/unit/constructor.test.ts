
import Web3Eth from '../../src/index'

const web3EthOptions = {providerString: 'http://127.0.0.1:8545'}

it('constructs a Web3Eth instance with expected properties', () => {
    const web3Eth = new Web3Eth(web3EthOptions)
    expect(web3Eth.packageName).toBe('eth')
    expect(web3Eth.requestManager.provider.providerString)
        .toBe(web3EthOptions.providerString)
    expect(!web3Eth.requestManager.provider.protectProvider)
})