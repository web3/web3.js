import { DEFAULT_ACCOUNTS } from '../constants';

const baseExpectedResult = {
    id: 42,
    jsonrpc: '2.0'
}

export const testsNoParams = [
    {
        name: 'getClientVersion',
        method: 'web3_clientVersion',
        expectedResult: {
            ...baseExpectedResult,
            result: 'Mist/v0.9.3/darwin/go1.4.1',
        }
    },
    {
        name: 'getNetworkVersion',
        method: 'net_version',
        expectedResult: {
            ...baseExpectedResult,
            result: '0x1',
        }
    },
    {
        name: 'getNetworkListening',
        method: 'net_listening',
        expectedResult: {
            ...baseExpectedResult,
            result: true,
        }
    },
    {
        name: 'getNetworkPeerCount',
        method: 'net_peerCount',
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
                result: '0x1',
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
                result: '0x1',
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: 1,
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: '1',
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: BigInt(1),
        }
    },
    {
        name: 'getProtocolVersion',
        method: 'eth_protocolVersion',
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
                result: '0x36',
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
                result: '0x36',
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: 54,
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: '54',
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: BigInt(54),
        }
    },
    {
        name: 'getSyncing',
        method: 'eth_syncing',
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: {
                startingBlock: '0x384',
                currentBlock: '0x386',
                highestBlock: '0x454',
            },
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: {
                startingBlock: '0x384',
                currentBlock: '0x386',
                highestBlock: '0x454',
            },
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: {
                startingBlock: 900,
                currentBlock: 902,
                highestBlock: 1108,
            },
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: {
                startingBlock: '900',
                currentBlock: '902',
                highestBlock: '1108',
            },
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: {
                startingBlock: BigInt(900),
                currentBlock: BigInt(902),
                highestBlock: BigInt(1108)
            },
        }
    },
    {
        name: 'getCoinbase',
        method: 'eth_coinbase',
        expectedResult: {
            ...baseExpectedResult,
            result: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
        }
    },
    {
        name: 'getMining',
        method: 'eth_mining',
        expectedResult: {
            ...baseExpectedResult,
            result: true,
        }
    },
    {
        name: 'getHashRate',
        method: 'eth_hashrate',
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: '0x38a',
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: '0x38a',
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: 906,
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: '906',
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: BigInt(906),
        }
    },
    {
        name: 'getGasPrice',
        method: 'eth_gasPrice',
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: '0x1dfd14000',
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: '0x1dfd14000',
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: 8049999872,
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: '8049999872',
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: BigInt(8049999872),
        }
    },
    {
        name: 'getAccounts',
        method: 'eth_accounts',
        expectedResult: {
            ...baseExpectedResult,
            result: DEFAULT_ACCOUNTS,
        }
    },
    {
        name: 'getBlockNumber',
        method: 'eth_blockNumber',
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: '0x4b7',
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: '0x4b7',
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: 1207,
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: '1207',
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: BigInt(1207),
        }
    },
    {
        name: 'getCompilers',
        method: 'eth_getCompilers',
        expectedResult: {
            ...baseExpectedResult,
            result: ['solidity', 'lll', 'serpent'],
        }
    },
    {
        name: 'newBlockFilter',
        method: 'eth_newBlockFilter',
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: '0x1',
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: '0x1',
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: 1,
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: '1',
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: BigInt(1),
        }
    },
    {
        name: 'newPendingTransactionFilter',
        method: 'eth_newPendingTransactionFilter',
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: '0x1',
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: '0x1',
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: 1,
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: '1',
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: BigInt(1),
        }
    },
    {
        name: 'getWork',
        method: 'eth_getWork',
        expectedResult: {
            ...baseExpectedResult,
            result: [
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                '0x5EED00000000000000000000000000005EED0000000000000000000000000000',
                '0xd1ff1c01710000000000000000000000d1ff1c01710000000000000000000000',
            ],
        }
    }
];

export const testsHasParams = [
    {
        name: 'getSha3',
        method: 'web3_sha3',
        params: ['0x68656c6c6f20776f726c64'],
        expectedResult: {
            ...baseExpectedResult,
            result: '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad'
        }
    },
    {
        name: 'getBalance',
        method: 'eth_getBalance',
        formatInput: true,
        params: [DEFAULT_ACCOUNTS[0], '0x2a'],
        paramsPrefixedHexString: [DEFAULT_ACCOUNTS[0], '0x2a'],
        paramsNumber: [DEFAULT_ACCOUNTS[0], 42],
        paramsNumberString: [DEFAULT_ACCOUNTS[0],'42'],
        paramsBigInt: [DEFAULT_ACCOUNTS[0], BigInt(42)],
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: '0x38a',
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: '0x36',
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: 906,
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: '906',
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: BigInt(906),
        }
    },
    {
        name: 'getStorageAt',
        method: 'eth_getStorageAt',
        formatInput: true,
        params: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '0x0',
            '0x2a'
        ],
        paramsPrefixedHexString: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '0x0',
            '0x2a'
        ],
        paramsNumber: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            0,
            42
        ],
        paramsNumberString: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '0',
            '42'
        ],
        paramsBigInt: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            BigInt(0),
            BigInt(42)
        ],
        supportsBlockTags: true,
        paramslatest: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '0x0',
            'latest'
        ],
        paramspending: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '0x0',
            'pending'
        ],
        paramsearliest: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '0x0',
            'earliest'
        ],
        expectedResult: {
            ...baseExpectedResult,
            result: '0x38a',
        }
    },
    {
        name: 'getTransactionCount',
        method: 'eth_getTransactionCount',
        formatInput: true,
        params: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '0x2a'
        ],
        paramsPrefixedHexString: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '0x2a'
        ],
        paramsNumber: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            42
        ],
        paramsNumberString: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '42'
        ],
        paramsBigInt: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            BigInt(42)
        ],
        supportsBlockTags: true,
        paramslatest: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            'latest'
        ],
        paramspending: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            'pending'
        ],
        paramsearliest: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            'earliest'
        ],
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: '0x38a',
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: '0x36',
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: 906,
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: '906',
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: BigInt(906),
        }
    },
    {
        name: 'getBlockTransactionCountByHash',
        method: 'eth_getBlockTransactionCountByHash',
        params: ['0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'],
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: '0x38a',
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: '0x36',
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: 906,
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: '906',
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: BigInt(906),
        }
    },
    {
        name: 'getBlockTransactionCountByNumber',
        method: 'eth_getBlockTransactionCountByNumber',
        formatInput: true,
        params: ['0x2a'],
        paramsPrefixedHexString: ['0x2a'],
        paramsNumber: [42],
        paramsNumberString: ['42'],
        paramsBigInt: [BigInt(42)],
        supportsBlockTags: true,
        paramslatest: ['latest'],
        paramspending: ['pending'],
        paramsearliest: ['earliest'],
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: '0x38a',
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: '0x36',
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: 906,
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: '906',
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: BigInt(906),
        }
    },
    {
        name: 'getUncleCountByBlockHash',
        method: 'eth_getUncleCountByBlockHash',
        params: ['0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'],
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: '0x38a',
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: '0x36',
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: 906,
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: '906',
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: BigInt(906),
        }
    },
    {
        name: 'getUncleCountByBlockNumber',
        method: 'eth_getUncleCountByBlockNumber',
        formatInput: true,
        params: ['0x2a'],
        paramsPrefixedHexString: ['0x2a'],
        paramsNumber: [42],
        paramsNumberString: ['42'],
        paramsBigInt: [BigInt(42)],
        supportsBlockTags: true,
        paramslatest: ['latest'],
        paramspending: ['pending'],
        paramsearliest: ['earliest'],
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: '0x38a',
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: '0x36',
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: 906,
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: '906',
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: BigInt(906),
        }
    },
    {
        name: 'getCode',
        method: 'eth_getCode',
        formatInput: true,
        params: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '0x2a'
        ],
        paramsPrefixedHexString: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '0x2a'
        ],
        paramsNumber: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            42
        ],
        paramsNumberString: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '42'
        ],
        paramsBigInt: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            BigInt(42)
        ],
        supportsBlockTags: true,
        paramslatest: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            'latest'
        ],
        paramspending: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            'pending'
        ],
        paramsearliest: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            'earliest'
        ]
    },
    {
        name: 'sign',
        method: 'eth_sign',
        params: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            "Don't blink"
        ],
    },
];