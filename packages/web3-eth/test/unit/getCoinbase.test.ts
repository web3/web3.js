
import { RpcResponse } from 'web3-internal-base/types'
import { checkAddress } from 'web3-utils'

import Web3Eth from '../../src/index'

const provider = 'http://127.0.0.1:8545'
const expectedId = 42

let web3Eth: Web3Eth

beforeAll(() => {
    web3Eth = new Web3Eth(provider);
})

// TODO - figure out how to test coinbase address (instead of just checking it's a string)

it('[SANITY] constructs a Web3Eth instance with getCoinbase method', () => {
    expect(web3Eth.getCoinbase).not.toBe(undefined)
})

it('should get protocol version - no params', async () => {
    const result: RpcResponse = await web3Eth.getCoinbase()
    console.log(result)
    expect(typeof result.id).toBe('number')
    expect(result.jsonrpc).toBe('2.0')
    expect(typeof result.result).toBe('string')
    if (typeof result.result !== 'string') throw Error(`${result.result} is expected to be a hex string address`)
    expect(checkAddress(result.result)).toBe(true)
})

it(`should get block number - id param should be ${expectedId}`, async () => {
    const result: RpcResponse = await web3Eth.getCoinbase({id: expectedId})
    expect(result.id).toBe(expectedId)
    expect(result.jsonrpc).toBe('2.0')
    expect(typeof result.result).toBe('string')
    if (typeof result.result !== 'string') throw Error(`${result.result} is expected to be a hex string address`)
    expect(checkAddress(result.result)).toBe(true)
})