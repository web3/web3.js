import Web3Eth from '../../src/index'
import {Web3EthOptions, BlockHashParameter} from '../../types'

describe('Web3Eth.getTransactionCountByHash', () => {
    let web3EthOptions: Web3EthOptions
    let parameters: BlockHashParameter

    beforeEach(() => {
        web3EthOptions = {
            providerUrl: 'http://127.0.0.1:8545'
        }
        parameters = {
            blockHash: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        }
    })

    it('should get expected transaction count', async () => {
        const web3Eth = new Web3Eth(web3EthOptions)
        const result = await web3Eth.getBlockTransactionCountByHash(parameters)
        // TODO undefined because block hash doesn't exist
        expect(result.result).toBe(undefined)
    })
})
