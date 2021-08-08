import { DEFAULT_ACCOUNTS } from '../constants';

const baseExpectedResult = {
    id: 42,
    jsonrpc: '2.0',
};

export const testsNoParams = [
    {
        name: 'getClientVersion',
        method: 'web3_clientVersion',
        expectedResult: {
            ...baseExpectedResult,
            result: 'Mist/v0.9.3/darwin/go1.4.1',
        },
    },
    {
        name: 'getNetworkVersion',
        method: 'net_version',
        expectedResult: {
            ...baseExpectedResult,
            result: '0x1',
        },
    },
    {
        name: 'getNetworkListening',
        method: 'net_listening',
        expectedResult: {
            ...baseExpectedResult,
            result: true,
        },
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
        },
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
        },
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
                highestBlock: BigInt(1108),
            },
        },
    },
    {
        name: 'getCoinbase',
        method: 'eth_coinbase',
        expectedResult: {
            ...baseExpectedResult,
            result: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
        },
    },
    {
        name: 'getMining',
        method: 'eth_mining',
        expectedResult: {
            ...baseExpectedResult,
            result: true,
        },
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
        },
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
        },
    },
    {
        name: 'getAccounts',
        method: 'eth_accounts',
        expectedResult: {
            ...baseExpectedResult,
            result: DEFAULT_ACCOUNTS,
        },
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
        },
    },
    {
        name: 'getCompilers',
        method: 'eth_getCompilers',
        expectedResult: {
            ...baseExpectedResult,
            result: ['solidity', 'lll', 'serpent'],
        },
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
        },
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
        },
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
        },
    },
];

export const testsHasParams = [
    {
        name: 'getSha3',
        method: 'web3_sha3',
        params: ['0x68656c6c6f20776f726c64'],
        expectedResult: {
            ...baseExpectedResult,
            result: '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad',
        },
    },
    {
        name: 'getBalance',
        method: 'eth_getBalance',
        formatInput: true,
        params: [DEFAULT_ACCOUNTS[0], '0x2a'],
        paramsPrefixedHexString: [DEFAULT_ACCOUNTS[0], '0x2a'],
        paramsNumber: [DEFAULT_ACCOUNTS[0], 42],
        paramsNumberString: [DEFAULT_ACCOUNTS[0], '42'],
        paramsBigInt: [DEFAULT_ACCOUNTS[0], BigInt(42)],
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
        },
    },
    {
        name: 'getStorageAt',
        method: 'eth_getStorageAt',
        formatInput: true,
        params: ['0x295a70b2de5e3953354a6a8344e616ed314d7251', '0x0', '0x2a'],
        paramsPrefixedHexString: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '0x0',
            '0x2a',
        ],
        paramsNumber: ['0x295a70b2de5e3953354a6a8344e616ed314d7251', 0, 42],
        paramsNumberString: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '0',
            '42',
        ],
        paramsBigInt: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            BigInt(0),
            BigInt(42),
        ],
        supportsBlockTags: true,
        paramslatest: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '0x0',
            'latest',
        ],
        paramspending: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '0x0',
            'pending',
        ],
        paramsearliest: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '0x0',
            'earliest',
        ],
        expectedResult: {
            ...baseExpectedResult,
            result: '0x38a',
        },
    },
    {
        name: 'getTransactionCount',
        method: 'eth_getTransactionCount',
        formatInput: true,
        params: ['0x295a70b2de5e3953354a6a8344e616ed314d7251', '0x2a'],
        paramsPrefixedHexString: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '0x2a',
        ],
        paramsNumber: ['0x295a70b2de5e3953354a6a8344e616ed314d7251', 42],
        paramsNumberString: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '42',
        ],
        paramsBigInt: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            BigInt(42),
        ],
        supportsBlockTags: true,
        paramslatest: ['0x295a70b2de5e3953354a6a8344e616ed314d7251', 'latest'],
        paramspending: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            'pending',
        ],
        paramsearliest: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            'earliest',
        ],
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
        },
    },
    {
        name: 'getBlockTransactionCountByHash',
        method: 'eth_getBlockTransactionCountByHash',
        params: [
            '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238',
        ],
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
        },
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
        },
    },
    {
        name: 'getUncleCountByBlockHash',
        method: 'eth_getUncleCountByBlockHash',
        params: [
            '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238',
        ],
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
        },
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
        },
    },
    {
        name: 'getCode',
        method: 'eth_getCode',
        formatInput: true,
        params: ['0x295a70b2de5e3953354a6a8344e616ed314d7251', '0x2a'],
        paramsPrefixedHexString: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '0x2a',
        ],
        paramsNumber: ['0x295a70b2de5e3953354a6a8344e616ed314d7251', 42],
        paramsNumberString: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            '42',
        ],
        paramsBigInt: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            BigInt(42),
        ],
        supportsBlockTags: true,
        paramslatest: ['0x295a70b2de5e3953354a6a8344e616ed314d7251', 'latest'],
        paramspending: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            'pending',
        ],
        paramsearliest: [
            '0x295a70b2de5e3953354a6a8344e616ed314d7251',
            'earliest',
        ],
        expectedResult: {
            ...baseExpectedResult,
            result: '0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056',
        },
    },
    {
        name: 'sign',
        method: 'eth_sign',
        params: ['0x295a70b2de5e3953354a6a8344e616ed314d7251', '0xc0ffe'],
        expectedResult: {
            ...baseExpectedResult,
            result: '0x00b227ebf7f1964350a49c00ec38d5177b3103a3daad188300fa54f3cd715c8d3750404dbdfa16154ea65e92f9278773bcac80f98e245eb9b5f1c0a25bca9f8600',
        },
    },
    {
        name: 'signTransaction',
        method: 'eth_signTransaction',
        formatInput: true,
        params: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: '0x76c0',
                gasPrice: '0x9184e72a000',
                value: '0x1',
                nonce: '0x1',
            },
        ],
        paramsPrefixedHexString: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: '0x76c0',
                gasPrice: '0x9184e72a000',
                value: '0x1',
                nonce: '0x1',
            },
        ],
        paramsNumber: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: 30400,
                gasPrice: 10000000000000,
                value: 1,
                nonce: 1,
            },
        ],
        paramsNumberString: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: '30400',
                gasPrice: '10000000000000',
                value: '1',
                nonce: '1',
            },
        ],
        paramsBigInt: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: BigInt(30400),
                gasPrice: BigInt(10000000000000),
                value: BigInt(1),
                nonce: BigInt(1),
            },
        ],
        expectedResult: {
            ...baseExpectedResult,
            result: '0xa3f20717a250c2b0b729b7e5becbff67fdaef7e0699da4de7ca5895b02a170a12d887fd3b17bfdce3481f10bea41f45ba9f709d39ce8325427b57afcfc994cee1b',
        },
    },
    {
        name: 'sendTransaction',
        method: 'eth_sendTransaction',
        formatInput: true,
        params: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: '0x76c0',
                gasPrice: '0x9184e72a000',
                value: '0x1',
                nonce: '0x1',
            },
        ],
        paramsPrefixedHexString: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: '0x76c0',
                gasPrice: '0x9184e72a000',
                value: '0x1',
                nonce: '0x1',
            },
        ],
        paramsNumber: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: 30400,
                gasPrice: 10000000000000,
                value: 1,
                nonce: 1,
            },
        ],
        paramsNumberString: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: '30400',
                gasPrice: '10000000000000',
                value: '1',
                nonce: '1',
            },
        ],
        paramsBigInt: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: BigInt(30400),
                gasPrice: BigInt(10000000000000),
                value: BigInt(1),
                nonce: BigInt(1),
            },
        ],
        expectedResult: {
            ...baseExpectedResult,
            result: '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331',
        },
    },
    {
        name: 'sendRawTransaction',
        method: 'eth_sendRawTransaction',
        params: [
            '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
        ],
        expectedResult: {
            ...baseExpectedResult,
            result: '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331',
        },
    },
    {
        name: 'call',
        method: 'eth_call',
        formatInput: true,
        params: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: '0x76c0',
                gasPrice: '0x9184e72a000',
                value: '0x1',
                nonce: '0x1',
            },
            '0x2a',
        ],
        paramsPrefixedHexString: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: '0x76c0',
                gasPrice: '0x9184e72a000',
                value: '0x1',
                nonce: '0x1',
            },
            '0x2a',
        ],
        paramsNumber: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: 30400,
                gasPrice: 10000000000000,
                value: 1,
                nonce: 1,
            },
            42,
        ],
        paramsNumberString: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: '30400',
                gasPrice: '10000000000000',
                value: '1',
                nonce: '1',
            },
            '42',
        ],
        paramsBigInt: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: BigInt(30400),
                gasPrice: BigInt(10000000000000),
                value: BigInt(1),
                nonce: BigInt(1),
            },
            BigInt(42),
        ],
        supportsBlockTags: true,
        paramslatest: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: '0x76c0',
                gasPrice: '0x9184e72a000',
                value: '0x1',
                nonce: '0x1',
            },
            'latest',
        ],
        paramspending: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: '0x76c0',
                gasPrice: '0x9184e72a000',
                value: '0x1',
                nonce: '0x1',
            },
            'pending',
        ],
        paramsearliest: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: '0x76c0',
                gasPrice: '0x9184e72a000',
                value: '0x1',
                nonce: '0x1',
            },
            'earliest',
        ],
        expectedResult: {
            ...baseExpectedResult,
            result: '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331',
        },
    },
    {
        name: 'estimateGas',
        method: 'eth_estimateGas',
        formatInput: true,
        params: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: '0x76c0',
                gasPrice: '0x9184e72a000',
                value: '0x1',
                nonce: '0x1',
            },
            '0x2a',
        ],
        paramsPrefixedHexString: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: '0x76c0',
                gasPrice: '0x9184e72a000',
                value: '0x1',
                nonce: '0x1',
            },
            '0x2a',
        ],
        paramsNumber: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: 30400,
                gasPrice: 10000000000000,
                value: 1,
                nonce: 1,
            },
            42,
        ],
        paramsNumberString: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: '30400',
                gasPrice: '10000000000000',
                value: '1',
                nonce: '1',
            },
            '42',
        ],
        paramsBigInt: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: BigInt(30400),
                gasPrice: BigInt(10000000000000),
                value: BigInt(1),
                nonce: BigInt(1),
            },
            BigInt(42),
        ],
        supportsBlockTags: true,
        paramslatest: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: '0x76c0',
                gasPrice: '0x9184e72a000',
                value: '0x1',
                nonce: '0x1',
            },
            'latest',
        ],
        paramspending: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: '0x76c0',
                gasPrice: '0x9184e72a000',
                value: '0x1',
                nonce: '0x1',
            },
            'pending',
        ],
        paramsearliest: [
            {
                from: DEFAULT_ACCOUNTS[0],
                to: DEFAULT_ACCOUNTS[1],
                gas: '0x76c0',
                gasPrice: '0x9184e72a000',
                value: '0x1',
                nonce: '0x1',
            },
            'earliest',
        ],
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: '0x5208',
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: '0x5208',
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: 21000,
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: '21000',
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: BigInt(21000),
        },
    },
    {
        name: 'getBlockByHash',
        method: 'eth_getBlockByHash',
        params: [
            '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331',
            true,
        ],
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: {
                difficulty: '0x4ea3f27bc',
                extraData:
                    '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
                gasLimit: '0x1388',
                gasUsed: '0x0',
                hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
                logsBloom:
                    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                miner: '0xbb7b8287f3f0a933474a79eae42cbca977791171',
                mixHash:
                    '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
                nonce: '0x689056015818adbe',
                number: '0x1b4',
                parentHash:
                    '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
                receiptsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                sha3Uncles:
                    '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                size: '0x220',
                stateRoot:
                    '0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d',
                timestamp: '0x55ba467c',
                totalDifficulty: '0x78ed983323d',
                transactions: [
                    {
                        blockHash:
                            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
                        blockNumber: '0x5daf3b',
                        from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
                        gas: '0xc350',
                        gasPrice: '0x4a817c800',
                        hash: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
                        input: '0x68656c6c6f21',
                        nonce: '0x15',
                        to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
                        transactionIndex: '0x41',
                        value: '0xf3dbb76162000',
                        v: '0x25',
                        r: '0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea',
                        s: '0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c',
                    },
                ],
                transactionsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                uncles: [],
            },
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: {
                difficulty: '0x4ea3f27bc',
                extraData:
                    '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
                gasLimit: '0x1388',
                gasUsed: '0x0',
                hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
                logsBloom:
                    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                miner: '0xbb7b8287f3f0a933474a79eae42cbca977791171',
                mixHash:
                    '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
                nonce: '0x689056015818adbe',
                number: '0x1b4',
                parentHash:
                    '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
                receiptsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                sha3Uncles:
                    '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                size: '0x220',
                stateRoot:
                    '0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d',
                timestamp: '0x55ba467c',
                totalDifficulty: '0x78ed983323d',
                transactions: [
                    {
                        blockHash:
                            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
                        blockNumber: '0x5daf3b',
                        from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
                        gas: '0xc350',
                        gasPrice: '0x4a817c800',
                        hash: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
                        input: '0x68656c6c6f21',
                        nonce: '0x15',
                        to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
                        transactionIndex: '0x41',
                        value: '0xf3dbb76162000',
                        v: '0x25',
                        r: '0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea',
                        s: '0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c',
                    },
                ],
                transactionsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                uncles: [],
            },
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: {
                difficulty: 21109876668,
                extraData:
                    '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
                gasLimit: 5000,
                gasUsed: 0,
                hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
                logsBloom:
                    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                miner: '0xbb7b8287f3f0a933474a79eae42cbca977791171',
                mixHash:
                    '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
                nonce: '0x689056015818adbe',
                number: 436,
                parentHash:
                    '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
                receiptsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                sha3Uncles:
                    '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                size: 544,
                stateRoot:
                    '0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d',
                timestamp: 1438271100,
                totalDifficulty: 8310116004413,
                transactions: [
                    {
                        blockHash:
                            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
                        blockNumber: 6139707,
                        from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
                        gas: 50000,
                        gasPrice: 20000000000,
                        hash: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
                        input: '0x68656c6c6f21',
                        nonce: 21,
                        to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
                        transactionIndex: 65,
                        value: 4290000000000000,
                        v: 37,
                        r: '0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea',
                        s: '0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c',
                    },
                ],
                transactionsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                uncles: [],
            },
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: {
                difficulty: '21109876668',
                extraData:
                    '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
                gasLimit: '5000',
                gasUsed: '0',
                hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
                logsBloom:
                    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                miner: '0xbb7b8287f3f0a933474a79eae42cbca977791171',
                mixHash:
                    '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
                nonce: '0x689056015818adbe',
                number: '436',
                parentHash:
                    '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
                receiptsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                sha3Uncles:
                    '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                size: '544',
                stateRoot:
                    '0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d',
                timestamp: '1438271100',
                totalDifficulty: '8310116004413',
                transactions: [
                    {
                        blockHash:
                            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
                        blockNumber: '6139707',
                        from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
                        gas: '50000',
                        gasPrice: '20000000000',
                        hash: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
                        input: '0x68656c6c6f21',
                        nonce: '21',
                        to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
                        transactionIndex: '65',
                        value: '4290000000000000',
                        v: '37',
                        r: '0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea',
                        s: '0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c',
                    },
                ],
                transactionsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                uncles: [],
            },
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: {
                difficulty: BigInt(21109876668),
                extraData:
                    '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
                gasLimit: BigInt(5000),
                gasUsed: BigInt(0),
                hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
                logsBloom:
                    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                miner: '0xbb7b8287f3f0a933474a79eae42cbca977791171',
                mixHash:
                    '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
                nonce: '0x689056015818adbe',
                number: BigInt(436),
                parentHash:
                    '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
                receiptsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                sha3Uncles:
                    '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                size: BigInt(544),
                stateRoot:
                    '0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d',
                timestamp: BigInt(1438271100),
                totalDifficulty: BigInt(8310116004413),
                transactions: [
                    {
                        blockHash:
                            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
                        blockNumber: BigInt(6139707),
                        from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
                        gas: BigInt(50000),
                        gasPrice: BigInt(20000000000),
                        hash: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
                        input: '0x68656c6c6f21',
                        nonce: BigInt(21),
                        to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
                        transactionIndex: BigInt(65),
                        value: BigInt(4290000000000000),
                        v: BigInt(37),
                        r: '0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea',
                        s: '0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c',
                    },
                ],
                transactionsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                uncles: [],
            },
        },
    },
    {
        name: 'getBlockByNumber',
        method: 'eth_getBlockByNumber',
        params: ['0x42', true],
        supportsBlockTags: true,
        paramslatest: ['latest', true],
        paramspending: ['pending', true],
        paramsearliest: ['earliest', true],
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: {
                difficulty: '0x4ea3f27bc',
                extraData:
                    '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
                gasLimit: '0x1388',
                gasUsed: '0x0',
                hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
                logsBloom:
                    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                miner: '0xbb7b8287f3f0a933474a79eae42cbca977791171',
                mixHash:
                    '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
                nonce: '0x689056015818adbe',
                number: '0x1b4',
                parentHash:
                    '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
                receiptsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                sha3Uncles:
                    '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                size: '0x220',
                stateRoot:
                    '0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d',
                timestamp: '0x55ba467c',
                totalDifficulty: '0x78ed983323d',
                transactions: [
                    {
                        blockHash:
                            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
                        blockNumber: '0x5daf3b',
                        from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
                        gas: '0xc350',
                        gasPrice: '0x4a817c800',
                        hash: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
                        input: '0x68656c6c6f21',
                        nonce: '0x15',
                        to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
                        transactionIndex: '0x41',
                        value: '0xf3dbb76162000',
                        v: '0x25',
                        r: '0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea',
                        s: '0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c',
                    },
                ],
                transactionsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                uncles: [],
            },
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: {
                difficulty: '0x4ea3f27bc',
                extraData:
                    '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
                gasLimit: '0x1388',
                gasUsed: '0x0',
                hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
                logsBloom:
                    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                miner: '0xbb7b8287f3f0a933474a79eae42cbca977791171',
                mixHash:
                    '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
                nonce: '0x689056015818adbe',
                number: '0x1b4',
                parentHash:
                    '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
                receiptsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                sha3Uncles:
                    '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                size: '0x220',
                stateRoot:
                    '0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d',
                timestamp: '0x55ba467c',
                totalDifficulty: '0x78ed983323d',
                transactions: [
                    {
                        blockHash:
                            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
                        blockNumber: '0x5daf3b',
                        from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
                        gas: '0xc350',
                        gasPrice: '0x4a817c800',
                        hash: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
                        input: '0x68656c6c6f21',
                        nonce: '0x15',
                        to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
                        transactionIndex: '0x41',
                        value: '0xf3dbb76162000',
                        v: '0x25',
                        r: '0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea',
                        s: '0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c',
                    },
                ],
                transactionsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                uncles: [],
            },
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: {
                difficulty: 21109876668,
                extraData:
                    '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
                gasLimit: 5000,
                gasUsed: 0,
                hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
                logsBloom:
                    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                miner: '0xbb7b8287f3f0a933474a79eae42cbca977791171',
                mixHash:
                    '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
                nonce: '0x689056015818adbe',
                number: 436,
                parentHash:
                    '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
                receiptsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                sha3Uncles:
                    '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                size: 544,
                stateRoot:
                    '0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d',
                timestamp: 1438271100,
                totalDifficulty: 8310116004413,
                transactions: [
                    {
                        blockHash:
                            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
                        blockNumber: 6139707,
                        from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
                        gas: 50000,
                        gasPrice: 20000000000,
                        hash: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
                        input: '0x68656c6c6f21',
                        nonce: 21,
                        to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
                        transactionIndex: 65,
                        value: 4290000000000000,
                        v: 37,
                        r: '0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea',
                        s: '0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c',
                    },
                ],
                transactionsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                uncles: [],
            },
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: {
                difficulty: '21109876668',
                extraData:
                    '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
                gasLimit: '5000',
                gasUsed: '0',
                hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
                logsBloom:
                    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                miner: '0xbb7b8287f3f0a933474a79eae42cbca977791171',
                mixHash:
                    '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
                nonce: '0x689056015818adbe',
                number: '436',
                parentHash:
                    '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
                receiptsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                sha3Uncles:
                    '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                size: '544',
                stateRoot:
                    '0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d',
                timestamp: '1438271100',
                totalDifficulty: '8310116004413',
                transactions: [
                    {
                        blockHash:
                            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
                        blockNumber: '6139707',
                        from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
                        gas: '50000',
                        gasPrice: '20000000000',
                        hash: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
                        input: '0x68656c6c6f21',
                        nonce: '21',
                        to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
                        transactionIndex: '65',
                        value: '4290000000000000',
                        v: '37',
                        r: '0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea',
                        s: '0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c',
                    },
                ],
                transactionsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                uncles: [],
            },
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: {
                difficulty: BigInt(21109876668),
                extraData:
                    '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
                gasLimit: BigInt(5000),
                gasUsed: BigInt(0),
                hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
                logsBloom:
                    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                miner: '0xbb7b8287f3f0a933474a79eae42cbca977791171',
                mixHash:
                    '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
                nonce: '0x689056015818adbe',
                number: BigInt(436),
                parentHash:
                    '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
                receiptsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                sha3Uncles:
                    '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                size: BigInt(544),
                stateRoot:
                    '0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d',
                timestamp: BigInt(1438271100),
                totalDifficulty: BigInt(8310116004413),
                transactions: [
                    {
                        blockHash:
                            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
                        blockNumber: BigInt(6139707),
                        from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
                        gas: BigInt(50000),
                        gasPrice: BigInt(20000000000),
                        hash: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
                        input: '0x68656c6c6f21',
                        nonce: BigInt(21),
                        to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
                        transactionIndex: BigInt(65),
                        value: BigInt(4290000000000000),
                        v: BigInt(37),
                        r: '0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea',
                        s: '0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c',
                    },
                ],
                transactionsRoot:
                    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                uncles: [],
            },
        },
    },
];
