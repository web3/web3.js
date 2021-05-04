import Web3Eth from '../../src/index'
import {Web3EthOptions, BlockIdentifierParameter} from '../../types'

describe('Web3Eth.getTransactionCountByNumber', () => {
    let web3EthOptions: Web3EthOptions
    let parameters: BlockIdentifierParameter

    beforeEach(() => {
        web3EthOptions = {
            providerUrl: 'http://127.0.0.1:8545'
        }
        parameters = {
            blockNumber: 0
        }
    })

    it('should get expected transaction count', async () => {
        const web3Eth = new Web3Eth(web3EthOptions)
        const result = await web3Eth.getBlockTransactionCountByNumber(parameters)
        expect(result.result).toBe('0x0')
    })

    it('should get expected transaction count for earliest block', async () => {
        parameters.blockNumber = 'earliest'

        const web3Eth = new Web3Eth(web3EthOptions)
        const result = await web3Eth.getBlockTransactionCountByNumber(parameters)
        expect(result.result).toBe('0x0')
    })

    it('should get expected transaction count for latest block', async () => {
        parameters.blockNumber = 'latest'

        const web3Eth = new Web3Eth(web3EthOptions)
        const result = await web3Eth.getBlockTransactionCountByNumber(parameters)
        expect(result.result).toBe('0x0')
    })

    it('should get expected transaction count for pending block', async () => {
        parameters.blockNumber = 'pending'

        const web3Eth = new Web3Eth(web3EthOptions)
        const result = await web3Eth.getBlockTransactionCountByNumber(parameters)
        expect(result.result).toBe('0x0')
    })
})
