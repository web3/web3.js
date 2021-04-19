
import { RpcResponseBigInt } from 'web3-internal-base/types'

import Web3Eth from '../../src/index'

const provider = 'http://127.0.0.1:8545'
const expectedId = 42
const expectedHashRate = BigInt(0)

let web3Eth: Web3Eth

beforeAll(() => {
    web3Eth = new Web3Eth(provider);
})

it('[SANITY] constructs a Web3Eth instance with getBlockNumber method', () => {
    expect(web3Eth.getHashRate).not.toBe(undefined)
})

it('should get mining status - no params', async () => {
    const result: RpcResponseBigInt = await web3Eth.getHashRate()
    expect(typeof result.id).toBe('number')
    expect(result.jsonrpc).toBe('2.0')
    expect(result.result).toBe(expectedHashRate)
})

it(`should get block number - id param should be ${expectedId}`, async () => {
    const result: RpcResponseBigInt = await web3Eth.getHashRate({id: expectedId})
    expect(result.id).toBe(expectedId)
    expect(result.jsonrpc).toBe('2.0')
    expect(result.result).toBe(expectedHashRate)  
})