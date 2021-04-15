
import { RpcResponse } from 'web3-internal-base/types'

import Web3Eth from '../../src/index'

const provider = 'http://127.0.0.1:8545';

let web3Eth: Web3Eth;

beforeAll(() => {
    web3Eth = new Web3Eth(provider);
})

it('[SANITY] constructs a Web3Eth instance with getBlockNumber method', () => {
    expect(web3Eth.getBlockNumber).not.toBe(undefined);
})

it('should get block number', async () => {
    const result: RpcResponse = await web3Eth.
    console.log(result)
    // { id: 7054039680174109, jsonrpc: '2.0', result: '0x0' }
    
})