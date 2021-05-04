import Web3Eth from '../../src/index'
import {Web3EthOptions, EthAddressBlockParmeters} from '../../types'
import {DEFAULT_GANACHE_ACCOUNTS} from '../constants'

describe('Web3Eth.getBalance', () => {
    let web3EthOptions: Web3EthOptions
    let parameters: EthAddressBlockParmeters

    beforeEach(() => {
        web3EthOptions = {
            providerUrl: 'http://127.0.0.1:8545'
        }
        parameters = {
            address: DEFAULT_GANACHE_ACCOUNTS[0]
        }
    })

    it(`should get expected balance for ${DEFAULT_GANACHE_ACCOUNTS[0]}`, async () => {
        const web3Eth = new Web3Eth(web3EthOptions)
        const result = await web3Eth.getBalance(parameters)
        expect(result.result).toBe(BigInt(100000000000000000000))
    })

    it(`should get expected balance for ${DEFAULT_GANACHE_ACCOUNTS[0]} using latest block`, async () => {
        parameters.block = 'latest'

        const web3Eth = new Web3Eth(web3EthOptions)
        const result = await web3Eth.getBalance(parameters)
        expect(result.result).toBe(BigInt(100000000000000000000))
    })

    it(`should get expected balance for ${DEFAULT_GANACHE_ACCOUNTS[0]} using earliest block`, async () => {
        parameters.block = 'earliest'

        const web3Eth = new Web3Eth(web3EthOptions)
        const result = await web3Eth.getBalance(parameters)
        expect(result.result).toBe(BigInt(100000000000000000000))
    })

    it(`should get expected balance for ${DEFAULT_GANACHE_ACCOUNTS[0]} using pending block`, async () => {
        parameters.block = 'pending'

        const web3Eth = new Web3Eth(web3EthOptions)
        const result = await web3Eth.getBalance(parameters)
        expect(result.result).toBe(BigInt(100000000000000000000))
    })

    it(`should get expected balance for ${DEFAULT_GANACHE_ACCOUNTS[0]} using 0 block`, async () => {
        parameters.block = 0

        const web3Eth = new Web3Eth(web3EthOptions)
        const result = await web3Eth.getBalance(parameters)
        expect(result.result).toBe(BigInt(100000000000000000000))
    })
})
