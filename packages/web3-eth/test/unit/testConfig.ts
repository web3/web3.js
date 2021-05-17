import { HttpRpcResponse } from 'web3-providers-http/types';
import { DEFAULT_ACCOUNTS } from '../constants';

interface Method {
    name: string;
    rpcMethod: string;
    parameters?: { [key: string]: string | number | BigInt };
    expectedResult: HttpRpcResponse;
    enumerateBlockIdentifiers?: boolean;
    parameterIsTransactionObject?: boolean;
}

interface TestConfig {
    providerUrl: string;
    jsonRpcVersion: string;
    expectedRpcId: number;
    methods: Method[];
}

const expectedRpcId = 42;
const expectedRpcVersion = '2.0';
const expectedResultBase = {
    id: expectedRpcId,
    jsonrpc: expectedRpcVersion,
    result: undefined,
};
export const testConfig: TestConfig = {
    providerUrl: 'http://127.0.0.1:8545',
    jsonRpcVersion: expectedRpcVersion,
    expectedRpcId: expectedRpcId,
    methods: [
        {
            name: 'getProtocolVersion',
            rpcMethod: 'eth_protocolVersion',
            expectedResult: { ...expectedResultBase, result: '54' },
        },
        {
            name: 'getSyncing',
            rpcMethod: 'eth_syncing',
            expectedResult: { ...expectedResultBase, result: true },
        },
        {
            name: 'getCoinbase',
            rpcMethod: 'eth_coinbase',
            expectedResult: {
                ...expectedResultBase,
                result: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
            },
        },
        {
            name: 'getMining',
            rpcMethod: 'eth_mining',
            expectedResult: { ...expectedResultBase, result: true },
        },
        {
            name: 'getHashRate',
            rpcMethod: 'eth_hashrate',
            expectedResult: { ...expectedResultBase, result: BigInt('0x38a') },
        },
        {
            name: 'getGasPrice',
            rpcMethod: 'eth_gasPrice',
            expectedResult: {
                ...expectedResultBase,
                result: BigInt(20000000000),
            },
        },
        {
            name: 'getAccounts',
            rpcMethod: 'eth_accounts',
            expectedResult: { ...expectedResultBase, result: DEFAULT_ACCOUNTS },
        },
        {
            name: 'getBlockNumber',
            rpcMethod: 'eth_blockNumber',
            expectedResult: { ...expectedResultBase, result: BigInt('0x4b7') },
        },
        {
            name: 'getBalance',
            rpcMethod: 'eth_getBalance',
            parameters: { address: DEFAULT_ACCOUNTS[0] },
            expectedResult: {
                ...expectedResultBase,
                result: BigInt('0x0234c8a3397aab58'),
            },
            enumerateBlockIdentifiers: true,
        },
        {
            name: 'getStorageAt',
            rpcMethod: 'eth_getStorageAt',
            parameters: {
                address: '0x295a70b2de5e3953354a6a8344e616ed314d7251',
                position: '0x0',
            },
            expectedResult: {
                ...expectedResultBase,
                result: '0x000000000000000000000000000000000000000000000000000000000000162e',
            },
            enumerateBlockIdentifiers: true,
        },
        {
            name: 'getTransactionCount',
            rpcMethod: 'eth_getTransactionCount',
            parameters: { address: DEFAULT_ACCOUNTS[0] },
            expectedResult: { ...expectedResultBase, result: '0x1' },
            enumerateBlockIdentifiers: true,
        },
        {
            name: 'getBlockTransactionCountByHash',
            rpcMethod: 'eth_getBlockTransactionCountByHash',
            parameters: {
                blockHash:
                    '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238',
            },
            expectedResult: { ...expectedResultBase, result: '0xb' },
        },
        {
            name: 'getBlockTransactionCountByNumber',
            rpcMethod: 'eth_getBlockTransactionCountByNumber',
            parameters: { blockNumber: 232 },
            expectedResult: { ...expectedResultBase, result: '0xb' },
        },
        {
            name: 'getUncleCountByBlockHash',
            rpcMethod: 'eth_getUncleCountByBlockHash',
            parameters: {
                blockHash:
                    '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238',
            },
            expectedResult: { ...expectedResultBase, result: '0x1' },
        },
        {
            name: 'getUncleCountByBlockNumber',
            rpcMethod: 'eth_getUncleCountByBlockNumber',
            parameters: { blockNumber: 232 },
            expectedResult: { ...expectedResultBase, result: '0x1' },
        },
        {
            name: 'getCode',
            rpcMethod: 'eth_getCode',
            parameters: {
                address: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
            },
            expectedResult: {
                ...expectedResultBase,
                result: '0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056',
            },
            enumerateBlockIdentifiers: true,
        },
        {
            name: 'sign',
            rpcMethod: 'eth_sign',
            parameters: {
                address: DEFAULT_ACCOUNTS[0],
                message: '0xc0ffe',
            },
            expectedResult: {
                ...expectedResultBase,
                result: '0x00b227ebf7f1964350a49c00ec38d5177b3103a3daad188300fa54f3cd715c8d3750404dbdfa16154ea65e92f9278773bcac80f98e245eb9b5f1c0a25bca9f8600',
            },
        },
        {
            name: 'signTransaction',
            rpcMethod: 'eth_signTransaction',
            parameters: {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: BigInt(30400),
                gasPrice: BigInt(10000000000000),
                value: BigInt(1),
            },
            expectedResult: { ...expectedResultBase, result: '0x1' },
            parameterIsTransactionObject: true,
        },
        {
            name: 'sendTransaction',
            rpcMethod: 'eth_sendTransaction',
            parameters: {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: BigInt(30400),
                gasPrice: BigInt(10000000000000),
                value: BigInt(1),
            },
            expectedResult: { ...expectedResultBase, result: '0x1' },
            parameterIsTransactionObject: true,
        },
        {
            name: 'sendRawTransaction',
            rpcMethod: 'eth_sendRawTransaction',
            parameters: {
                rawTransaction:
                    '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
            },
            expectedResult: {
                ...expectedResultBase,
                result: '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331',
            },
        },
    ],
};
