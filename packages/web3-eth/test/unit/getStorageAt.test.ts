import Web3Eth from '../../src/index'
import {Web3EthOptions, EthGetStorageAtParameters} from '../../types'

describe('Web3Eth.getStorageAt', () => {
    let web3EthOptions: Web3EthOptions
    let parameters: EthGetStorageAtParameters

    beforeEach(() => {
        web3EthOptions = {
            providerUrl: 'http://127.0.0.1:8545'
        }
        parameters = {
            address: '0x295a70b2de5e3953354a6a8344e616ed314d7251', // Arbitrary address
            position: '0x0'
        }
    })

    it('should get expected storage', async () => {
        const web3Eth = new Web3Eth(web3EthOptions)
        const result = await web3Eth.getStorageAt(parameters)
        expect(result.result).toBe('0x0')
    })
})
