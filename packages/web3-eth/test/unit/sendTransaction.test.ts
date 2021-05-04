import Web3Eth from '../../src/index'
import {EthTransaction, Web3EthOptions } from '../../types'
import {DEFAULT_GANACHE_ACCOUNTS} from '../constants'

describe('Web3Eth.sendTransaction', () => {
    let web3EthOptions: Web3EthOptions
    let transaction: EthTransaction

    beforeEach(() => {
        web3EthOptions = {
            providerUrl: 'http://127.0.0.1:8545'
        }
        transaction = {
            from: DEFAULT_GANACHE_ACCOUNTS[0],
            to: DEFAULT_GANACHE_ACCOUNTS[1],
            gas: BigInt(30400),
            gasPrice: BigInt(10000000000000),
            value: BigInt(1)
        }
    })

    // TODO Works, but need to isolate ganache instance, as this causes other tests
    // like getTransactionCount to have unexpected values
    xit('should correctly sign data', async () => {
        const web3Eth = new Web3Eth(web3EthOptions)
        const result = await web3Eth.sendTransaction(transaction)
        expect(result.result).not.toBe(undefined)
    })
})
