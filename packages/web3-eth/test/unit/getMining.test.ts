
import { RpcResponse } from 'web3-internal-base/types'

import Web3Eth from '../../src/index'

const provider = 'http://127.0.0.1:8545'
const expectedId = 42

let web3Eth: Web3Eth

beforeAll(() => {
    web3Eth = new Web3Eth(provider);
})

// TODO Figure out how to mock mining status

it('[SANITY] constructs a Web3Eth instance with getBlockNumber method', () => {
    expect(web3Eth.getMining).not.toBe(undefined)
})

it('should get mining status - no params', async () => {
    const result: RpcResponse = await web3Eth.getMining()
    expect(typeof result.id).toBe('number')
    expect(result.jsonrpc).toBe('2.0')
    expect(result.result).toBe(true)
})

it(`should get block number - id param should be ${expectedId}`, async () => {
    const result: RpcResponse = await web3Eth.getMining({id: expectedId})
    expect(result.id).toBe(expectedId)
    expect(result.jsonrpc).toBe('2.0')
    expect(result.result).toBe(true)  
})