import { RpcResponse, RpcResponseBigInt } from 'web3-internal-base/types'
import { checkAddress } from 'web3-utils'

import Web3Eth from '../../src/index'

interface configMethod {
    name: string
    provider?: string
    expectedResult?: any
    expectedId: number
    expectedResultMethod?: any
}

interface IConfig {
    provider: string
    methods: configMethod[]
}

const config: IConfig = {
    provider: 'http://127.0.0.1:8545',
    methods: [
        {
            name: 'getBlockNumber',
            expectedId: 42,
            expectedResult: BigInt(0)
        },
        {
            name: 'getCoinbase',
            expectedId: 42,
            expectedResultMethod: (rpcResponse: RpcResponse) => {
                if (typeof rpcResponse.result !== 'string') throw Error(`${rpcResponse.result} is expected to be a hex string address`)
                expect(checkAddress(rpcResponse.result)).toBe(true)
            }
        },
        {
            name: 'getHashRate',
            expectedId: 42,
            expectedResult: BigInt(0)
        },
        {
            name: 'getMining',
            expectedId: 42,
            expectedResult: true
        },
        {
            name: 'getSyncing',
            expectedId: 42,
            expectedResult: false
        },
        {
            name: 'getProtocolVersion',
            expectedId: 42,
            expectedResultMethod: (rpcResponse: RpcResponseBigInt) => 
                expect(typeof rpcResponse.result).toBe('bigint')
        },
    ]
}

let web3Eth: Web3Eth

for (const method of config.methods) {
    beforeAll(() => {
        web3Eth = new Web3Eth(config.provider);
    })

    it(`[SANITY](${method.name}) constructs a Web3Eth instance with method defined`, () => {
        expect(web3Eth[method.name]).not.toBe(undefined)
    })
    
    it(`(${method.name}) should get expected result - no params`, async () => {
        const result: RpcResponse | RpcResponseBigInt = await web3Eth[method.name]()
        expect(typeof result.id).toBe('number')
        expect(result.jsonrpc).toBe('2.0')
        method.expectedResultMethod ? method.expectedResultMethod(result) : 
            expect(result.result).toBe(method.expectedResult)
    })
    
    it(`(${method.name}) should get expected result - id param should be ${method.expectedId}`, async () => {
        const result: RpcResponse | RpcResponseBigInt = await web3Eth[method.name]({id: method.expectedId})
        expect(result.id).toBe(method.expectedId)
        expect(result.jsonrpc).toBe('2.0')
        method.expectedResultMethod ? method.expectedResultMethod(result) : 
            expect(result.result).toBe(method.expectedResult)
    })
}
