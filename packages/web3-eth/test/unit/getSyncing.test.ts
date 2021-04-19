
import Web3Eth from '../../src/index'
import { RpcResponseSyncing } from '../../types'

const provider = 'http://127.0.0.1:8545'
const expectedId = 42

let web3Eth: Web3Eth

beforeAll(() => {
    web3Eth = new Web3Eth(provider);
})

// TODO - Add tests that use syncing node, or figure out how to mock

it('[SANITY] constructs a Web3Eth instance with getSyncing method', () => {
    expect(web3Eth.getSyncing).not.toBe(undefined)
})

it('should get syncing info - no params', async () => {
    const result: RpcResponseSyncing = await web3Eth.getSyncing()
    expect(typeof result.id).toBe('number')
    expect(result.jsonrpc).toBe('2.0')
    expect(result.result).toBe(false)
})

it(`should get syncing info - id param should be ${expectedId}`, async () => {
    const result: RpcResponseSyncing = await web3Eth.getSyncing({id: expectedId})
    expect(result.id).toBe(expectedId)
    expect(result.jsonrpc).toBe('2.0')
    expect(result.result).toBe(false)
})