import Web3Eth from '../../src/index'
import {Web3EthOptions, EthAddressBlockParmeters} from '../../types'

describe('Web3Eth.getCode', () => {
    let web3EthOptions: Web3EthOptions
    let parameters: EthAddressBlockParmeters

    beforeEach(() => {
        web3EthOptions = {
            providerUrl: 'http://127.0.0.1:8545'
        }
        parameters = {
            address: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'
        }
    })

    it('should get expected transaction count', async () => {
        const web3Eth = new Web3Eth(web3EthOptions)
        const result = await web3Eth.getCode(parameters)
        expect(result.result).toBe('0x')
    })

    it('should get expected transaction count using latest block', async () => {
        parameters.block = 'latest'

        const web3Eth = new Web3Eth(web3EthOptions)
        const result = await web3Eth.getCode(parameters)
        expect(result.result).toBe('0x')
    })

    it('should get expected transaction count using earliest block', async () => {
        parameters.block = 'earliest'

        const web3Eth = new Web3Eth(web3EthOptions)
        const result = await web3Eth.getCode(parameters)
        expect(result.result).toBe('0x')
    })

    it('should get expected transaction count using pending block', async () => {
        parameters.block = 'pending'

        const web3Eth = new Web3Eth(web3EthOptions)
        const result = await web3Eth.getCode(parameters)
        expect(result.result).toBe('0x')
    })

    it('should get expected transaction count using 0 block', async () => {
        parameters.block = 0

        const web3Eth = new Web3Eth(web3EthOptions)
        const result = await web3Eth.getCode(parameters)
        expect(result.result).toBe('0x')
    })
})
