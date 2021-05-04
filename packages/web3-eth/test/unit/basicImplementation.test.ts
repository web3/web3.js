import {HttpRpcResponse} from 'web3-providers-http/types'
import {isValidAddress} from 'ethereumjs-util'

import Web3Eth from '../../src/index'
import {DEFAULT_GANACHE_ACCOUNTS} from '../constants'

interface configMethod {
    name: string
    provider?: string
    jsonRpcVersion?: string
    params?: {[key: string]: string | number}
    expectedResult?: any
    expectedId: number
    expectedResultMethod?: any
}

interface IConfig {
    provider: string
    jsonRpcVersion: string
    methods: configMethod[]
}

const config: IConfig = {
    provider: 'http://127.0.0.1:8545',
    jsonRpcVersion: '2.0',
    methods: [
        {
            name: 'getProtocolVersion',
            expectedId: 42,
            expectedResultMethod: (httpRpcResponse: HttpRpcResponse) => 
                expect(typeof httpRpcResponse.result).toBe('bigint')
        },
        {
            name: 'getSyncing',
            expectedId: 42,
            expectedResult: false
        },
        {
            name: 'getCoinbase',
            expectedId: 42,
            expectedResultMethod: (httpRpcResponse: HttpRpcResponse) => {
                if (typeof httpRpcResponse.result !== 'string') throw Error(`${httpRpcResponse.result} is expected to be a hex string address`)
                expect(isValidAddress(httpRpcResponse.result)).toBe(true)
            }
        },
        {
            name: 'getMining',
            expectedId: 42,
            expectedResult: true
        },
        {
            name: 'getHashRate',
            expectedId: 42,
            expectedResult: BigInt(0)
        },
        {
            name: 'getGasPrice',
            expectedId: 42,
            expectedResult: BigInt(20000000000)
        },
        {
            name: 'getAccounts',
            expectedId: 42,
            expectedResult: DEFAULT_GANACHE_ACCOUNTS
        },
        {
            name: 'getBlockNumber',
            expectedId: 42,
            expectedResult: BigInt(0)
        },
        {
            name: 'getBalance',
            params: {
                address: DEFAULT_GANACHE_ACCOUNTS[0]
            },
            expectedId: 42,
            expectedResult: BigInt(100000000000000000000)
        },
        {
            name: 'getBalance',
            params: {
                address: DEFAULT_GANACHE_ACCOUNTS[0],
                block: 'earliest'
            },
            expectedId: 42,
            expectedResult: BigInt(100000000000000000000)
        },
    ]
}

let web3Eth: Web3Eth

for (const method of config.methods) {
    describe(`Web3Eth.${method.name}`, () => {
        beforeAll(() => {
            web3Eth = new Web3Eth({
                providerUrl: method.provider ? method.provider : config.provider
            });
        })
    
        it('should construct a Web3Eth instance with method defined', () => {
            // @ts-ignore
            expect(web3Eth[method.name]).not.toBe(undefined)
        })
        
        it('should get expected result - no HTTP RPC params', async () => {
            const result: HttpRpcResponse = method.params ?
                // @ts-ignore
                await web3Eth[method.name](method.params, {id: method.expectedId})
                // @ts-ignore
                : await web3Eth[method.name]({id: method.expectedId})
            expect(typeof result.id).toBe('number')
            expect(result.jsonrpc).toBe(method.jsonRpcVersion ? method.jsonRpcVersion : config.jsonRpcVersion)
            method.expectedResultMethod ? method.expectedResultMethod(result) : 
                expect(result.result).toStrictEqual(method.expectedResult)
        })
        
        it('should get expected result - with id param', async () => {
            const result: HttpRpcResponse = method.params ?
                // @ts-ignore
                await web3Eth[method.name](method.params, {id: method.expectedId})
                // @ts-ignore
                : await web3Eth[method.name]({id: method.expectedId})
            expect(result.id).toBe(method.expectedId)
            expect(result.jsonrpc).toBe(method.jsonRpcVersion ? method.jsonRpcVersion : config.jsonRpcVersion)
            method.expectedResultMethod ? method.expectedResultMethod(result) : 
                expect(result.result).toStrictEqual(method.expectedResult)
        })
    })
}
