
import { FormattedRpcResponse } from 'web3-internal-base/types'

import Web3Eth from '../../src/index'

const provider = 'http://127.0.0.1:8545'
const expectedId = 42

let web3Eth: Web3Eth

beforeAll(() => {
    web3Eth = new Web3Eth(provider);
})

it('[SANITY] constructs a Web3Eth instance with getProtocolVersion method', () => {
    expect(web3Eth.getProtocolVersion).not.toBe(undefined)
})

it('should get protocol version - no params', async () => {
    const result: FormattedRpcResponse = await web3Eth.getProtocolVersion()
    expect(typeof result.id).toBe('number')
    expect(result.jsonrpc).toBe('2.0')
    expect(typeof result.result).toBe('bigint')
})

it(`should get block number - id param should be ${expectedId}`, async () => {
    const result: FormattedRpcResponse = await web3Eth.getProtocolVersion({id: expectedId})
    expect(result.id).toBe(expectedId)
    expect(result.jsonrpc).toBe('2.0')
    expect(typeof result.result).toBe('bigint')
})