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
    {
        name: 'getTransactionByHash',
        method: 'eth_getTransactionByHash',
        params: [
            '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
        ],
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: {
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
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: {
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
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: {
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
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: {
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
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: {
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
        },
    },
    {
        name: 'getTransactionByBlockHashAndIndex',
        method: 'eth_getTransactionByBlockHashAndIndex',
        formatInput: true,
        params: [
            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
            '0x5daf3b',
        ],
        paramsPrefixedHexString: [
            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
            '0x5daf3b',
        ],
        paramsNumber: [
            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
            6139707,
        ],
        paramsNumberString: [
            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
            '6139707',
        ],
        paramsBigInt: [
            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
            BigInt(6139707),
        ],
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: {
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
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: {
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
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: {
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
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: {
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
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: {
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
        },
    },
    {
        name: 'getTransactionByBlockNumberAndIndex',
        method: 'eth_getTransactionByBlockNumberAndIndex',
        formatInput: true,
        params: [
            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
            '0x0',
        ],
        paramsPrefixedHexString: [
            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
            '0x0',
        ],
        paramsNumber: [
            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
            0,
        ],
        paramsNumberString: [
            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
            '0',
        ],
        paramsBigInt: [
            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
            BigInt(0),
        ],
        supportsBlockTags: true,
        paramslatest: ['latest', '0x0'],
        paramspending: ['pending', '0x0'],
        paramsearliest: ['earliest', '0x0'],
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: {
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
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: {
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
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: {
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
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: {
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
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: {
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
        },
    },
    {
        name: 'getTransactionReceipt',
        method: 'eth_getTransactionReceipt',
        params: [
            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
        ],
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: {
                blockHash:
                    '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                blockNumber: '0xc66332',
                contractAddress: null,
                cumulativeGasUsed: '0xc22f34',
                effectiveGasPrice: '0xa83613262',
                from: '0xcfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                gasUsed: '0x265fe',
                logs: [
                    {
                        address: '0xd084b83c305dafd76ae3e1b4e1f1fe2ecccb3988',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '0xc66332',
                        data: '0x0000000000000000000000000000000000000000000000147ebc6d689cc81c8c',
                        logIndex: '0xf2',
                        removed: false,
                        topics: [
                            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                            '0x0000000000000000000000000f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '0xc8',
                    },
                    {
                        address: '0xd084b83c305dafd76ae3e1b4e1f1fe2ecccb3988',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '0xc66332',
                        data: '0xffffffffffffffffffffffffffffffffffffffffffffffeb814392976337e373',
                        logIndex: '0xf3',
                        removed: false,
                        topics: [
                            '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                            '0x0000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '0xc8',
                    },
                    {
                        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '0xc66332',
                        data: '0x000000000000000000000000000000000000000000000000007e981f5f0e4018',
                        logIndex: '0xf4',
                        removed: false,
                        topics: [
                            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                            '0x0000000000000000000000000f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                            '0x00000000000000000000000060a39010e4892b862d1bb6bdde908215ac5af6f3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '0xc8',
                    },
                    {
                        address: '0x0f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '0xc66332',
                        data: '0x00000000000000000000000000000000000000000000002362b0dbb63633df2600000000000000000000000000000000000000000005b63e5a5dc3f942033f80',
                        logIndex: '0xf5',
                        removed: false,
                        topics: [
                            '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '0xc8',
                    },
                    {
                        address: '0x0f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '0xc66332',
                        data: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000147ebc6d689cc81c8c000000000000000000000000000000000000000000000000007e981f5f0e40180000000000000000000000000000000000000000000000000000000000000000',
                        logIndex: '0xf6',
                        removed: false,
                        topics: [
                            '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
                            '0x0000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d',
                            '0x00000000000000000000000060a39010e4892b862d1bb6bdde908215ac5af6f3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '0xc8',
                    },
                    {
                        address: '0xd2877702675e6ceb975b4a1dff9fb7baf4c91ea9',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '0xc66332',
                        data: '0x0000000000000000000000000000000000000000000000005be981cd5e0f9b66',
                        logIndex: '0xf7',
                        removed: false,
                        topics: [
                            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                            '0x00000000000000000000000060a39010e4892b862d1bb6bdde908215ac5af6f3',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '0xc8',
                    },
                    {
                        address: '0x60a39010e4892b862d1bb6bdde908215ac5af6f3',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '0xc66332',
                        data: '0x0000000000000000000000000000000000000000000000214b43d8a780502a3100000000000000000000000000000000000000000000183e7812544df46cb224',
                        logIndex: '0xf8',
                        removed: false,
                        topics: [
                            '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '0xc8',
                    },
                    {
                        address: '0x60a39010e4892b862d1bb6bdde908215ac5af6f3',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '0xc66332',
                        data: '0x000000000000000000000000000000000000000000000000007e981f5f0e4018000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005be981cd5e0f9b66',
                        logIndex: '0xf9',
                        removed: false,
                        topics: [
                            '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
                            '0x0000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '0xc8',
                    },
                ],
                logsBloom:
                    '0x002000000000000200000000800000000000000000000000000100000000000000000000000000000000000000000000020000000800000000000000002000000000000000000000000000080000002000000000000000000000000000000000080000000000000000000000000000000000000000000000000000100008000000000000000800000040000000000000000000000000000800000040000000800200000000000000000000000000000000020000000001004000000000008000004000020000000000000000000800000000000020000010000100000000a0000010a00000000000000100000000000040000040000600000000000002000000',
                status: '0x1',
                to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
                transactionHash:
                    '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                transactionIndex: '0xc8',
                type: '0x2',
            },
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: {
                blockHash:
                    '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                blockNumber: '0xc66332',
                contractAddress: null,
                cumulativeGasUsed: '0xc22f34',
                effectiveGasPrice: '0xa83613262',
                from: '0xcfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                gasUsed: '0x265fe',
                logs: [
                    {
                        address: '0xd084b83c305dafd76ae3e1b4e1f1fe2ecccb3988',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '0xc66332',
                        data: '0x0000000000000000000000000000000000000000000000147ebc6d689cc81c8c',
                        logIndex: '0xf2',
                        removed: false,
                        topics: [
                            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                            '0x0000000000000000000000000f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '0xc8',
                    },
                    {
                        address: '0xd084b83c305dafd76ae3e1b4e1f1fe2ecccb3988',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '0xc66332',
                        data: '0xffffffffffffffffffffffffffffffffffffffffffffffeb814392976337e373',
                        logIndex: '0xf3',
                        removed: false,
                        topics: [
                            '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                            '0x0000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '0xc8',
                    },
                    {
                        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '0xc66332',
                        data: '0x000000000000000000000000000000000000000000000000007e981f5f0e4018',
                        logIndex: '0xf4',
                        removed: false,
                        topics: [
                            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                            '0x0000000000000000000000000f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                            '0x00000000000000000000000060a39010e4892b862d1bb6bdde908215ac5af6f3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '0xc8',
                    },
                    {
                        address: '0x0f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '0xc66332',
                        data: '0x00000000000000000000000000000000000000000000002362b0dbb63633df2600000000000000000000000000000000000000000005b63e5a5dc3f942033f80',
                        logIndex: '0xf5',
                        removed: false,
                        topics: [
                            '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '0xc8',
                    },
                    {
                        address: '0x0f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '0xc66332',
                        data: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000147ebc6d689cc81c8c000000000000000000000000000000000000000000000000007e981f5f0e40180000000000000000000000000000000000000000000000000000000000000000',
                        logIndex: '0xf6',
                        removed: false,
                        topics: [
                            '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
                            '0x0000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d',
                            '0x00000000000000000000000060a39010e4892b862d1bb6bdde908215ac5af6f3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '0xc8',
                    },
                    {
                        address: '0xd2877702675e6ceb975b4a1dff9fb7baf4c91ea9',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '0xc66332',
                        data: '0x0000000000000000000000000000000000000000000000005be981cd5e0f9b66',
                        logIndex: '0xf7',
                        removed: false,
                        topics: [
                            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                            '0x00000000000000000000000060a39010e4892b862d1bb6bdde908215ac5af6f3',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '0xc8',
                    },
                    {
                        address: '0x60a39010e4892b862d1bb6bdde908215ac5af6f3',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '0xc66332',
                        data: '0x0000000000000000000000000000000000000000000000214b43d8a780502a3100000000000000000000000000000000000000000000183e7812544df46cb224',
                        logIndex: '0xf8',
                        removed: false,
                        topics: [
                            '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '0xc8',
                    },
                    {
                        address: '0x60a39010e4892b862d1bb6bdde908215ac5af6f3',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '0xc66332',
                        data: '0x000000000000000000000000000000000000000000000000007e981f5f0e4018000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005be981cd5e0f9b66',
                        logIndex: '0xf9',
                        removed: false,
                        topics: [
                            '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
                            '0x0000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '0xc8',
                    },
                ],
                logsBloom:
                    '0x002000000000000200000000800000000000000000000000000100000000000000000000000000000000000000000000020000000800000000000000002000000000000000000000000000080000002000000000000000000000000000000000080000000000000000000000000000000000000000000000000000100008000000000000000800000040000000000000000000000000000800000040000000800200000000000000000000000000000000020000000001004000000000008000004000020000000000000000000800000000000020000010000100000000a0000010a00000000000000100000000000040000040000600000000000002000000',
                status: '0x1',
                to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
                transactionHash:
                    '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                transactionIndex: '0xc8',
                type: '0x2',
            },
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: {
                blockHash:
                    '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                blockNumber: 13001522,
                contractAddress: null,
                cumulativeGasUsed: 12726068,
                effectiveGasPrice: '0xa83613262',
                from: '0xcfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                gasUsed: 157182,
                logs: [
                    {
                        address: '0xd084b83c305dafd76ae3e1b4e1f1fe2ecccb3988',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: 13001522,
                        data: '0x0000000000000000000000000000000000000000000000147ebc6d689cc81c8c',
                        logIndex: 242,
                        removed: false,
                        topics: [
                            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                            '0x0000000000000000000000000f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: 200,
                    },
                    {
                        address: '0xd084b83c305dafd76ae3e1b4e1f1fe2ecccb3988',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: 13001522,
                        data: '0xffffffffffffffffffffffffffffffffffffffffffffffeb814392976337e373',
                        logIndex: 243,
                        removed: false,
                        topics: [
                            '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                            '0x0000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: 200,
                    },
                    {
                        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: 13001522,
                        data: '0x000000000000000000000000000000000000000000000000007e981f5f0e4018',
                        logIndex: 244,
                        removed: false,
                        topics: [
                            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                            '0x0000000000000000000000000f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                            '0x00000000000000000000000060a39010e4892b862d1bb6bdde908215ac5af6f3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: 200,
                    },
                    {
                        address: '0x0f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: 13001522,
                        data: '0x00000000000000000000000000000000000000000000002362b0dbb63633df2600000000000000000000000000000000000000000005b63e5a5dc3f942033f80',
                        logIndex: 245,
                        removed: false,
                        topics: [
                            '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: 200,
                    },
                    {
                        address: '0x0f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: 13001522,
                        data: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000147ebc6d689cc81c8c000000000000000000000000000000000000000000000000007e981f5f0e40180000000000000000000000000000000000000000000000000000000000000000',
                        logIndex: 246,
                        removed: false,
                        topics: [
                            '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
                            '0x0000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d',
                            '0x00000000000000000000000060a39010e4892b862d1bb6bdde908215ac5af6f3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: 200,
                    },
                    {
                        address: '0xd2877702675e6ceb975b4a1dff9fb7baf4c91ea9',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: 13001522,
                        data: '0x0000000000000000000000000000000000000000000000005be981cd5e0f9b66',
                        logIndex: 247,
                        removed: false,
                        topics: [
                            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                            '0x00000000000000000000000060a39010e4892b862d1bb6bdde908215ac5af6f3',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: 200,
                    },
                    {
                        address: '0x60a39010e4892b862d1bb6bdde908215ac5af6f3',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: 13001522,
                        data: '0x0000000000000000000000000000000000000000000000214b43d8a780502a3100000000000000000000000000000000000000000000183e7812544df46cb224',
                        logIndex: 248,
                        removed: false,
                        topics: [
                            '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: 200,
                    },
                    {
                        address: '0x60a39010e4892b862d1bb6bdde908215ac5af6f3',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: 13001522,
                        data: '0x000000000000000000000000000000000000000000000000007e981f5f0e4018000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005be981cd5e0f9b66',
                        logIndex: 249,
                        removed: false,
                        topics: [
                            '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
                            '0x0000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: 200,
                    },
                ],
                logsBloom:
                    '0x002000000000000200000000800000000000000000000000000100000000000000000000000000000000000000000000020000000800000000000000002000000000000000000000000000080000002000000000000000000000000000000000080000000000000000000000000000000000000000000000000000100008000000000000000800000040000000000000000000000000000800000040000000800200000000000000000000000000000000020000000001004000000000008000004000020000000000000000000800000000000020000010000100000000a0000010a00000000000000100000000000040000040000600000000000002000000',
                status: 1,
                to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
                transactionHash:
                    '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                transactionIndex: 200,
                type: '0x2',
            },
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: {
                blockHash:
                    '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                blockNumber: '13001522',
                contractAddress: null,
                cumulativeGasUsed: '12726068',
                effectiveGasPrice: '0xa83613262',
                from: '0xcfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                gasUsed: '157182',
                logs: [
                    {
                        address: '0xd084b83c305dafd76ae3e1b4e1f1fe2ecccb3988',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '13001522',
                        data: '0x0000000000000000000000000000000000000000000000147ebc6d689cc81c8c',
                        logIndex: '242',
                        removed: false,
                        topics: [
                            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                            '0x0000000000000000000000000f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '200',
                    },
                    {
                        address: '0xd084b83c305dafd76ae3e1b4e1f1fe2ecccb3988',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '13001522',
                        data: '0xffffffffffffffffffffffffffffffffffffffffffffffeb814392976337e373',
                        logIndex: '243',
                        removed: false,
                        topics: [
                            '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                            '0x0000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '200',
                    },
                    {
                        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '13001522',
                        data: '0x000000000000000000000000000000000000000000000000007e981f5f0e4018',
                        logIndex: '244',
                        removed: false,
                        topics: [
                            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                            '0x0000000000000000000000000f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                            '0x00000000000000000000000060a39010e4892b862d1bb6bdde908215ac5af6f3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '200',
                    },
                    {
                        address: '0x0f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '13001522',
                        data: '0x00000000000000000000000000000000000000000000002362b0dbb63633df2600000000000000000000000000000000000000000005b63e5a5dc3f942033f80',
                        logIndex: '245',
                        removed: false,
                        topics: [
                            '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '200',
                    },
                    {
                        address: '0x0f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '13001522',
                        data: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000147ebc6d689cc81c8c000000000000000000000000000000000000000000000000007e981f5f0e40180000000000000000000000000000000000000000000000000000000000000000',
                        logIndex: '246',
                        removed: false,
                        topics: [
                            '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
                            '0x0000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d',
                            '0x00000000000000000000000060a39010e4892b862d1bb6bdde908215ac5af6f3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '200',
                    },
                    {
                        address: '0xd2877702675e6ceb975b4a1dff9fb7baf4c91ea9',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '13001522',
                        data: '0x0000000000000000000000000000000000000000000000005be981cd5e0f9b66',
                        logIndex: '247',
                        removed: false,
                        topics: [
                            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                            '0x00000000000000000000000060a39010e4892b862d1bb6bdde908215ac5af6f3',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '200',
                    },
                    {
                        address: '0x60a39010e4892b862d1bb6bdde908215ac5af6f3',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '13001522',
                        data: '0x0000000000000000000000000000000000000000000000214b43d8a780502a3100000000000000000000000000000000000000000000183e7812544df46cb224',
                        logIndex: '248',
                        removed: false,
                        topics: [
                            '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '200',
                    },
                    {
                        address: '0x60a39010e4892b862d1bb6bdde908215ac5af6f3',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: '13001522',
                        data: '0x000000000000000000000000000000000000000000000000007e981f5f0e4018000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005be981cd5e0f9b66',
                        logIndex: '249',
                        removed: false,
                        topics: [
                            '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
                            '0x0000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: '200',
                    },
                ],
                logsBloom:
                    '0x002000000000000200000000800000000000000000000000000100000000000000000000000000000000000000000000020000000800000000000000002000000000000000000000000000080000002000000000000000000000000000000000080000000000000000000000000000000000000000000000000000100008000000000000000800000040000000000000000000000000000800000040000000800200000000000000000000000000000000020000000001004000000000008000004000020000000000000000000800000000000020000010000100000000a0000010a00000000000000100000000000040000040000600000000000002000000',
                status: '1',
                to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
                transactionHash:
                    '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                transactionIndex: '200',
                type: '0x2',
            },
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: {
                blockHash:
                    '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                blockNumber: BigInt(13001522),
                contractAddress: null,
                cumulativeGasUsed: BigInt(12726068),
                effectiveGasPrice: '0xa83613262',
                from: '0xcfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                gasUsed: BigInt(157182),
                logs: [
                    {
                        address: '0xd084b83c305dafd76ae3e1b4e1f1fe2ecccb3988',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: BigInt(13001522),
                        data: '0x0000000000000000000000000000000000000000000000147ebc6d689cc81c8c',
                        logIndex: BigInt(242),
                        removed: false,
                        topics: [
                            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                            '0x0000000000000000000000000f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: BigInt(200),
                    },
                    {
                        address: '0xd084b83c305dafd76ae3e1b4e1f1fe2ecccb3988',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: BigInt(13001522),
                        data: '0xffffffffffffffffffffffffffffffffffffffffffffffeb814392976337e373',
                        logIndex: BigInt(243),
                        removed: false,
                        topics: [
                            '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                            '0x0000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: BigInt(200),
                    },
                    {
                        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: BigInt(13001522),
                        data: '0x000000000000000000000000000000000000000000000000007e981f5f0e4018',
                        logIndex: BigInt(244),
                        removed: false,
                        topics: [
                            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                            '0x0000000000000000000000000f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                            '0x00000000000000000000000060a39010e4892b862d1bb6bdde908215ac5af6f3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: BigInt(200),
                    },
                    {
                        address: '0x0f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: BigInt(13001522),
                        data: '0x00000000000000000000000000000000000000000000002362b0dbb63633df2600000000000000000000000000000000000000000005b63e5a5dc3f942033f80',
                        logIndex: BigInt(245),
                        removed: false,
                        topics: [
                            '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: BigInt(200),
                    },
                    {
                        address: '0x0f5a2eb364d8b722cba4e1e30e2cf57b6f515b2a',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: BigInt(13001522),
                        data: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000147ebc6d689cc81c8c000000000000000000000000000000000000000000000000007e981f5f0e40180000000000000000000000000000000000000000000000000000000000000000',
                        logIndex: BigInt(246),
                        removed: false,
                        topics: [
                            '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
                            '0x0000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d',
                            '0x00000000000000000000000060a39010e4892b862d1bb6bdde908215ac5af6f3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: BigInt(200),
                    },
                    {
                        address: '0xd2877702675e6ceb975b4a1dff9fb7baf4c91ea9',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: BigInt(13001522),
                        data: '0x0000000000000000000000000000000000000000000000005be981cd5e0f9b66',
                        logIndex: BigInt(247),
                        removed: false,
                        topics: [
                            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                            '0x00000000000000000000000060a39010e4892b862d1bb6bdde908215ac5af6f3',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: BigInt(200),
                    },
                    {
                        address: '0x60a39010e4892b862d1bb6bdde908215ac5af6f3',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: BigInt(13001522),
                        data: '0x0000000000000000000000000000000000000000000000214b43d8a780502a3100000000000000000000000000000000000000000000183e7812544df46cb224',
                        logIndex: BigInt(248),
                        removed: false,
                        topics: [
                            '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: BigInt(200),
                    },
                    {
                        address: '0x60a39010e4892b862d1bb6bdde908215ac5af6f3',
                        blockHash:
                            '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
                        blockNumber: BigInt(13001522),
                        data: '0x000000000000000000000000000000000000000000000000007e981f5f0e4018000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005be981cd5e0f9b66',
                        logIndex: BigInt(249),
                        removed: false,
                        topics: [
                            '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
                            '0x0000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d',
                            '0x000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
                        ],
                        transactionHash:
                            '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                        transactionIndex: BigInt(200),
                    },
                ],
                logsBloom:
                    '0x002000000000000200000000800000000000000000000000000100000000000000000000000000000000000000000000020000000800000000000000002000000000000000000000000000080000002000000000000000000000000000000000080000000000000000000000000000000000000000000000000000100008000000000000000800000040000000000000000000000000000800000040000000800200000000000000000000000000000000020000000001004000000000008000004000020000000000000000000800000000000020000010000100000000a0000010a00000000000000100000000000040000040000600000000000002000000',
                status: BigInt(1),
                to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
                transactionHash:
                    '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
                transactionIndex: BigInt(200),
                type: '0x2',
            },
        },
    },
    {
        name: 'getUncleByBlockHashAndIndex',
        method: 'eth_getUncleByBlockHashAndIndex',
        formatInput: true,
        params: [
            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
            '0x2a',
        ],
        paramsPrefixedHexString: [
            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
            '0x2a',
        ],
        paramsNumber: [
            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
            42,
        ],
        paramsNumberString: [
            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
            '42',
        ],
        paramsBigInt: [
            '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
            BigInt(42),
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
        name: 'getUncleByBlockNumberAndIndex',
        method: 'eth_getUncleByBlockNumberAndIndex',
        formatInput: true,
        params: ['0x5daf3b', '0x2a'],
        paramsPrefixedHexString: ['0x5daf3b', '0x2a'],
        paramsNumber: [6139707, 42],
        paramsNumberString: ['6139707', '42'],
        paramsBigInt: [BigInt(6139707), BigInt(42)],
        supportsBlockTags: true,
        paramslatest: ['latest', '0x2a'],
        paramspending: ['pending', '0x2a'],
        paramsearliest: ['earliest', '0x2a'],
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
        name: 'compileSolidity',
        method: 'eth_compileSolidity',
        params: [
            'contract test { function multiply(uint a) returns(uint d) {   return a * 7;   } }',
        ],
        expectedResult: {
            ...baseExpectedResult,
            result: {
                code: '0x605880600c6000396000f3006000357c010000000000000000000000000000000000000000000000000000000090048063c6888fa114602e57005b603d6004803590602001506047565b8060005260206000f35b60006007820290506053565b91905056',
                info: {
                    source: 'contract test {\n   function multiply(uint a) constant returns(uint d) {\n       return a * 7;\n   }\n}\n',
                    language: 'Solidity',
                    languageVersion: '0',
                    compilerVersion: '0.9.19',
                    abiDefinition: [
                        {
                            constant: true,
                            inputs: [
                                {
                                    name: 'a',
                                    type: 'uint256',
                                },
                            ],
                            name: 'multiply',
                            outputs: [
                                {
                                    name: 'd',
                                    type: 'uint256',
                                },
                            ],
                            type: 'function',
                        },
                    ],
                    userDoc: {
                        methods: {},
                    },
                    developerDoc: {
                        methods: {},
                    },
                },
            },
        },
    },
    {
        name: 'compileLLL',
        method: 'eth_compileLLL',
        params: ['(returnlll (suicide (caller)))'],
        expectedResult: {
            ...baseExpectedResult,
            result: '0x603880600c6000396000f3006001600060e060020a600035048063c6888fa114601857005b6021600435602b565b8060005260206000f35b600081600702905091905056',
        },
    },
    {
        name: 'compileSerpent',
        method: 'eth_compileSerpent',
        params: ['/* some serpent */'],
        expectedResult: {
            ...baseExpectedResult,
            result: '0x603880600c6000396000f3006001600060e060020a600035048063c6888fa114601857005b6021600435602b565b8060005260206000f35b600081600702905091905056',
        },
    },
    {
        name: 'newFilter',
        method: 'eth_newFilter',
        formatInput: true,
        params: [
            {
                filter: {
                    fromBlock: '0x1',
                    toBlock: '0x2',
                    address: '0x8888f1f195afa192cfee860698584c030f4c9db1',
                    topics: [
                        '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                        null,
                        [
                            '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                            '0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
                        ],
                    ],
                },
            },
        ],
        paramsPrefixedHexString: [
            {
                filter: {
                    fromBlock: '0x1',
                    toBlock: '0x2',
                    address: '0x8888f1f195afa192cfee860698584c030f4c9db1',
                    topics: [
                        '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                        null,
                        [
                            '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                            '0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
                        ],
                    ],
                },
            },
        ],
        paramsNumber: [
            {
                filter: {
                    fromBlock: 1,
                    toBlock: 2,
                    address: '0x8888f1f195afa192cfee860698584c030f4c9db1',
                    topics: [
                        '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                        null,
                        [
                            '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                            '0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
                        ],
                    ],
                },
            },
        ],
        paramsNumberString: [
            {
                filter: {
                    fromBlock: '1',
                    toBlock: '2',
                    address: '0x8888f1f195afa192cfee860698584c030f4c9db1',
                    topics: [
                        '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                        null,
                        [
                            '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                            '0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
                        ],
                    ],
                },
            },
        ],
        paramsBigInt: [
            {
                filter: {
                    fromBlock: BigInt(1),
                    toBlock: BigInt(2),
                    address: '0x8888f1f195afa192cfee860698584c030f4c9db1',
                    topics: [
                        '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                        null,
                        [
                            '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                            '0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
                        ],
                    ],
                },
            },
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
        name: 'uninstallFilter',
        method: 'eth_uninstallFilter',
        formatInput: true,
        params: ['0x1'],
        paramsPrefixedHexString: ['0x1'],
        paramsNumber: [1],
        paramsNumberString: ['1'],
        paramsBigInt: [BigInt(1)],
        expectedResult: {
            ...baseExpectedResult,
            result: true,
        },
    },
    {
        name: 'getFilterChanges',
        method: 'eth_getFilterChanges',
        formatInput: true,
        params: ['0x1'],
        paramsPrefixedHexString: ['0x1'],
        paramsNumber: [1],
        paramsNumberString: ['1'],
        paramsBigInt: [BigInt(1)],
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: [
                {
                    logIndex: '0x1',
                    blockNumber: '0x1b4',
                    blockHash:
                        '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    transactionHash:
                        '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
                    transactionIndex: '0x0',
                    address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    topics: [
                        '0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5',
                    ],
                },
            ],
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: [
                {
                    logIndex: '0x1',
                    blockNumber: '0x1b4',
                    blockHash:
                        '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    transactionHash:
                        '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
                    transactionIndex: '0x0',
                    address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    topics: [
                        '0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5',
                    ],
                },
            ],
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: [
                {
                    logIndex: 1,
                    blockNumber: 436,
                    blockHash:
                        '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    transactionHash:
                        '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
                    transactionIndex: 0,
                    address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    topics: [
                        '0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5',
                    ],
                },
            ],
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: [
                {
                    logIndex: '1',
                    blockNumber: '436',
                    blockHash:
                        '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    transactionHash:
                        '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
                    transactionIndex: '0',
                    address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    topics: [
                        '0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5',
                    ],
                },
            ],
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: [
                {
                    logIndex: BigInt(1),
                    blockNumber: BigInt(436),
                    blockHash:
                        '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    transactionHash:
                        '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
                    transactionIndex: BigInt(0),
                    address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    topics: [
                        '0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5',
                    ],
                },
            ],
        },
    },
    {
        name: 'getFilterLogs',
        method: 'eth_getFilterLogs',
        formatInput: true,
        params: ['0x1'],
        paramsPrefixedHexString: ['0x1'],
        paramsNumber: [1],
        paramsNumberString: ['1'],
        paramsBigInt: [BigInt(1)],
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: [
                {
                    logIndex: '0x1',
                    blockNumber: '0x1b4',
                    blockHash:
                        '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    transactionHash:
                        '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
                    transactionIndex: '0x0',
                    address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    topics: [
                        '0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5',
                    ],
                },
            ],
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: [
                {
                    logIndex: '0x1',
                    blockNumber: '0x1b4',
                    blockHash:
                        '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    transactionHash:
                        '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
                    transactionIndex: '0x0',
                    address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    topics: [
                        '0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5',
                    ],
                },
            ],
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: [
                {
                    logIndex: 1,
                    blockNumber: 436,
                    blockHash:
                        '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    transactionHash:
                        '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
                    transactionIndex: 0,
                    address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    topics: [
                        '0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5',
                    ],
                },
            ],
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: [
                {
                    logIndex: '1',
                    blockNumber: '436',
                    blockHash:
                        '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    transactionHash:
                        '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
                    transactionIndex: '0',
                    address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    topics: [
                        '0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5',
                    ],
                },
            ],
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: [
                {
                    logIndex: BigInt(1),
                    blockNumber: BigInt(436),
                    blockHash:
                        '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    transactionHash:
                        '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
                    transactionIndex: BigInt(0),
                    address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    topics: [
                        '0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5',
                    ],
                },
            ],
        },
    },
    {
        name: 'getLogs',
        method: 'eth_getLogs',
        formatInput: true,
        params: [
            {
                filter: {
                    fromBlock: '0x1',
                    toBlock: '0x2',
                    address: '0x8888f1f195afa192cfee860698584c030f4c9db1',
                    topics: [
                        '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                        null,
                        [
                            '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                            '0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
                        ],
                    ],
                },
            },
        ],
        paramsPrefixedHexString: [
            {
                filter: {
                    fromBlock: '0x1',
                    toBlock: '0x2',
                    address: '0x8888f1f195afa192cfee860698584c030f4c9db1',
                    topics: [
                        '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                        null,
                        [
                            '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                            '0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
                        ],
                    ],
                },
            },
        ],
        paramsNumber: [
            {
                filter: {
                    fromBlock: 1,
                    toBlock: 2,
                    address: '0x8888f1f195afa192cfee860698584c030f4c9db1',
                    topics: [
                        '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                        null,
                        [
                            '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                            '0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
                        ],
                    ],
                },
            },
        ],
        paramsNumberString: [
            {
                filter: {
                    fromBlock: '1',
                    toBlock: '2',
                    address: '0x8888f1f195afa192cfee860698584c030f4c9db1',
                    topics: [
                        '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                        null,
                        [
                            '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                            '0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
                        ],
                    ],
                },
            },
        ],
        paramsBigInt: [
            {
                filter: {
                    fromBlock: BigInt(1),
                    toBlock: BigInt(2),
                    address: '0x8888f1f195afa192cfee860698584c030f4c9db1',
                    topics: [
                        '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                        null,
                        [
                            '0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                            '0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
                        ],
                    ],
                },
            },
        ],
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: [
                {
                    logIndex: '0x1',
                    blockNumber: '0x1b4',
                    blockHash:
                        '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    transactionHash:
                        '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
                    transactionIndex: '0x0',
                    address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    topics: [
                        '0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5',
                    ],
                },
            ],
        },
        expectedResultPrefixedHexString: {
            ...baseExpectedResult,
            result: [
                {
                    logIndex: '0x1',
                    blockNumber: '0x1b4',
                    blockHash:
                        '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    transactionHash:
                        '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
                    transactionIndex: '0x0',
                    address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    topics: [
                        '0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5',
                    ],
                },
            ],
        },
        expectedResultNumber: {
            ...baseExpectedResult,
            result: [
                {
                    logIndex: 1,
                    blockNumber: 436,
                    blockHash:
                        '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    transactionHash:
                        '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
                    transactionIndex: 0,
                    address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    topics: [
                        '0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5',
                    ],
                },
            ],
        },
        expectedResultNumberString: {
            ...baseExpectedResult,
            result: [
                {
                    logIndex: '1',
                    blockNumber: '436',
                    blockHash:
                        '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    transactionHash:
                        '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
                    transactionIndex: '0',
                    address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    topics: [
                        '0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5',
                    ],
                },
            ],
        },
        expectedResultBigInt: {
            ...baseExpectedResult,
            result: [
                {
                    logIndex: BigInt(1),
                    blockNumber: BigInt(436),
                    blockHash:
                        '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    transactionHash:
                        '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
                    transactionIndex: BigInt(0),
                    address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    topics: [
                        '0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5',
                    ],
                },
            ],
        },
    },
    {
        name: 'submitWork',
        method: 'eth_submitWork',
        formatInput: true,
        params: [
            '0x000000000000002a',
            '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            '0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000',
        ],
        paramsPrefixedHexString: [
            '0x000000000000002a',
            '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            '0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000',
        ],
        paramsNumber: [
            42,
            '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            '0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000',
        ],
        paramsNumberString: [
            '42',
            '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            '0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000',
        ],
        paramsBigInt: [
            BigInt(42),
            '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            '0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000',
        ],
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: true,
        },
    },
    {
        name: 'submitHashRate',
        method: 'eth_submitHashRate',
        formatInput: true,
        params: [
            '0x0000000000000000000000000000000000000000000000000000000000500000',
            '0x59daa26581d0acd1fce254fb7e85952f4c09d0915afd33d3886cd914bc7d283c',
        ],
        paramsPrefixedHexString: [
            '0x0000000000000000000000000000000000000000000000000000000000500000',
            '0x59daa26581d0acd1fce254fb7e85952f4c09d0915afd33d3886cd914bc7d283c',
        ],
        paramsNumber: [42, 12],
        paramsNumberString: ['42', '12'],
        paramsBigInt: [BigInt(42), BigInt(12)],
        formatOutput: true,
        expectedResult: {
            ...baseExpectedResult,
            result: true,
        },
    },
];
