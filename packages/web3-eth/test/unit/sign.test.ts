import Web3Eth from '../../src/index'
import { EthSignParameters, Web3EthOptions } from '../../types'
import {DEFAULT_GANACHE_ACCOUNTS} from '../constants'

describe('Web3Eth.sign', () => {
    let web3EthOptions: Web3EthOptions
    let parameters: EthSignParameters

    beforeEach(() => {
        web3EthOptions = {
            providerUrl: 'http://127.0.0.1:8545'
        }
        parameters = {
            address: DEFAULT_GANACHE_ACCOUNTS[0],
            message: '0xc0ffe'
        }
    })

    it('should correctly sign data', async () => {
        const expectedSignature = '0x00b227ebf7f1964350a49c00ec38d5177b3103a3daad188300fa54f3cd715c8d3750404dbdfa16154ea65e92f9278773bcac80f98e245eb9b5f1c0a25bca9f8600'

        const web3Eth = new Web3Eth(web3EthOptions)
        const result = await web3Eth.sign(parameters)
        expect(result.result).toBe(expectedSignature)
    })
})
