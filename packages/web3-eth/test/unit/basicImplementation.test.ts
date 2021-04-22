import { HttpRpcResponse } from 'web3-providers-http/types'
import { checkAddress } from 'web3-utils'

import Web3Eth from '../../src/index'

interface configMethod {
    name: string
    provider?: string
    jsonRpcVersion?: string
    expectedResult?: any
    expectedId: number
    expectedResultMethod?: any
}

interface IConfig {
    provider: string
    jsonRpcVersion: string
    methods: configMethod[]
}
const DEFAULT_GANACHE_ACCOUNTS = [
    '0x6849a369b4dd0e5c5ba95906e1d19cff8f65c3a6',
    '0xbed4e839f5173e0a8b4b8b78a7ac230d593c7361',
    '0x4c14bc7b632c8f2df6b28844a1e126d2ea94d1eb',
    '0x41f83491dbc34a1412f436d7e0ce1394b21856dc',
    '0x4f262c7efedbc037db6aea270f745a73ffcdf7a4',
    '0x2544c4fe49f82857f240ae46f5c24fbee00516af',
    '0xd99461eb5a5b87a562ff5b3e55e250798ffb16b9',
    '0x79eb9a40aba68aedb611ae43e561c397e9f7b661',
    '0x9b11224603d977c97e72f52de65e271e29c8ec24',
    '0xfc3a28dcb317ade139e3dfe01a35abe0562ab712'
]

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
        // {
        //     name: 'getSyncing',
        //     expectedId: 42,
        //     expectedResult: false
        // },
        // {
        //     name: 'getCoinbase',
        //     expectedId: 42,
        //     expectedResultMethod: (rpcResponse: RpcResponse) => {
        //         if (typeof rpcResponse.result !== 'string') throw Error(`${rpcResponse.result} is expected to be a hex string address`)
        //         expect(checkAddress(rpcResponse.result)).toBe(true)
        //     }
        // },
        // {
        //     name: 'getMining',
        //     expectedId: 42,
        //     expectedResult: true
        // },
        // {
        //     name: 'getHashRate',
        //     expectedId: 42,
        //     expectedResult: BigInt(0)
        // },
        // {
        //     name: 'getGasPrice',
        //     expectedId: 42,
        //     expectedResult: BigInt(20000000000)
        // },
        // {
        //     name: 'getAccounts',
        //     expectedId: 42,
        //     expectedResult: DEFAULT_GANACHE_ACCOUNTS
        // },
        // {
        //     name: 'getBlockNumber',
        //     expectedId: 42,
        //     expectedResult: BigInt(0)
        // },
    ]
}

let web3Eth: Web3Eth

for (const method of config.methods) {
    beforeAll(() => {
        web3Eth = new Web3Eth({
            providerString: method.provider ? method.provider : config.provider
        });
    })

    it(`[SANITY](${method.name}) constructs a Web3Eth instance with method defined`, () => {
        expect(web3Eth[method.name]).not.toBe(undefined)
    })
    
    it(`(${method.name}) should get expected result - no params`, async () => {
        const result: HttpRpcResponse = await web3Eth[method.name]()
        expect(typeof result.id).toBe('number')
        expect(result.jsonrpc).toBe(method.jsonRpcVersion ? method.jsonRpcVersion : config.jsonRpcVersion)
        method.expectedResultMethod ? method.expectedResultMethod(result) : 
            expect(result.result).toStrictEqual(method.expectedResult)
    })
    
    it(`(${method.name}) should get expected result - id param`, async () => {
        const result: HttpRpcResponse = await web3Eth[method.name]({id: method.expectedId})
        expect(result.id).toBe(method.expectedId)
        expect(result.jsonrpc).toBe(method.jsonRpcVersion ? method.jsonRpcVersion : config.jsonRpcVersion)
        method.expectedResultMethod ? method.expectedResultMethod(result) : 
            expect(result.result).toStrictEqual(method.expectedResult)
    })
}
