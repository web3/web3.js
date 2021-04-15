
import { Web3Eth } from '../../src/index'

const provider = 'http://127.0.0.1:8545'
const methodPrefix = 'eth_'

it('constructs a Web3Eth instance with expected properties', () => {
    const web3Eth = new Web3Eth(provider)
    expect(web3Eth.name).toBe('eth')
    expect(web3Eth.provider).toBe(provider)
    expect(web3Eth.protectProvider)
    expect(web3Eth.methodPrefix).toBe(methodPrefix)
})