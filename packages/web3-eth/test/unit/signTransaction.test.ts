import Web3Eth from '../../src/index'
import {EthTransaction, Web3EthOptions } from '../../types'
import {DEFAULT_GANACHE_ACCOUNTS} from '../constants'

describe('Web3Eth.signTransaction', () => {
    let web3EthOptions: Web3EthOptions
    let transaction: EthTransaction

    beforeEach(() => {
        web3EthOptions = {
            providerUrl: 'http://127.0.0.1:8545'
        }
        transaction = {
            from: DEFAULT_GANACHE_ACCOUNTS[0],
            to: DEFAULT_GANACHE_ACCOUNTS[1],
        }
    })

    // TODO Ganche doesn't support eth_sendTransaction
    // figure out how to test this method
    xit('should correctly sign data', async () => {
        const expectedSignature = '0x00b227ebf7f1964350a49c00ec38d5177b3103a3daad188300fa54f3cd715c8d3750404dbdfa16154ea65e92f9278773bcac80f98e245eb9b5f1c0a25bca9f8600'

        const web3Eth = new Web3Eth(web3EthOptions)
        const result = await web3Eth.signTransaction(transaction)
        console.log(result)
        expect(result.result).toBe(expectedSignature)
    })
})
