import Web3RequestManager from 'web3-core-requestmanager'

import Web3Eth from '../../src/index'
import {Web3EthOptions, EthAddressBlockParmeters, blockIdentifier} from '../../types'

describe('Web3Eth.getCode', () => {
    const expectedReturnValue = {
        id: 42,
        jsonrpc: '2.0',
        result: '0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056'
    }
    const blockIdentifiers: blockIdentifier[] = [undefined, 'latest', 'earliest', 'pending', 42]

    let web3RequestManagerSendSpy: jest.SpyInstance
    let web3EthOptions: Web3EthOptions
    let parameters: EthAddressBlockParmeters

    beforeAll(() => {
        Web3RequestManager.prototype.send = jest.fn()
        // @ts-ignore mockReturnValue added by jest
        Web3RequestManager.prototype.send.mockReturnValue(expectedReturnValue)
        web3RequestManagerSendSpy = jest.spyOn(Web3RequestManager.prototype, 'send')
    })

    beforeEach(() => {
        web3EthOptions = {
            providerUrl: 'http://127.0.0.1:8545'
        }
        parameters = {
            address: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'
        }
    })

    for (const blockParameter of blockIdentifiers) {
        it('should get expected return value', async () => {
            if (blockParameter !== undefined) parameters.block = blockParameter

            const web3Eth = new Web3Eth(web3EthOptions)
            const result = await web3Eth.getBalance(parameters)
            expect(result.result).toMatchObject(expectedReturnValue)
        })
    }
})
