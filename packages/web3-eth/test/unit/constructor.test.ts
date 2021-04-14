
import { Web3Eth } from '../../src/index'

const provider = 'http://127.0.0.1:9596'
const providerSuffix = '/'

it('constructs a ETH2BeaconChain instance with expected properties', () => {
    const web3Eth = new Web3Eth(provider)
    expect(web3Eth.name).toBe('eth')
    expect(web3Eth.provider).toBe(`${provider}${providerSuffix}`)
    expect(web3Eth.protectProvider)
})