import {HttpRpcResponse} from "web3-providers-http/types";
import { DEFAULT_ACCOUNTS } from "../constants";

interface Method {
    name: string
    parameters?: {[key: string]: string | number}
    expectedResult: HttpRpcResponse
    enumerateBlockIdentifiers?: boolean
}

interface TestConfig {
    providerUrl: string
    jsonRpcVersion: string
    expectedRpcId: number,
    methods: Method[]
}

const expectedRpcId = 42
const expectedRpcVersion = '2.0'
const expectedResultBase = {
    id: expectedRpcId,
    jsonrpc: expectedRpcVersion,
    result: undefined
}
export const testConfig: TestConfig = {
    providerUrl: 'http://127.0.0.1:8545',
    jsonRpcVersion: expectedRpcVersion,
    expectedRpcId: expectedRpcId,
    methods: [
        {
            name: 'getProtocolVersion',
            expectedResult: {...expectedResultBase, result: '54'}
        },
        {
            name: 'getSyncing',
            expectedResult: {...expectedResultBase, result: true}
        },
        {
            name: 'getCoinbase',
            expectedResult: {...expectedResultBase, result: '0x407d73d8a49eeb85d32cf465507dd71d507100c1'}
        },
        {
            name: 'getMining',
            expectedResult: {...expectedResultBase, result: true}
        },
        {
            name: 'getHashRate',
            expectedResult: {...expectedResultBase, result: BigInt('0x38a')}
        },
        {
            name: 'getGasPrice',
            expectedResult: {...expectedResultBase, result: BigInt(20000000000)}
        },
        {
            name: 'getAccounts',
            expectedResult: {...expectedResultBase, result: DEFAULT_ACCOUNTS}
        },
        {
            name: 'getBlockNumber',
            expectedResult: {...expectedResultBase, result: BigInt('0x4b7')}
        },
        {
            name: 'getBalance',
            parameters: {account: DEFAULT_ACCOUNTS[0]},
            expectedResult: {...expectedResultBase, result: BigInt('0x0234c8a3397aab58')}
        },
    ]
}