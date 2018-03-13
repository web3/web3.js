var testSubscription = require('./helpers/test.subscription.js');

    // NEW HEADS
var tests = [{
    protocol: 'eth',
    args: ['newBlockHeaders'],
    firstResult: '0x1234',
    firstPayload: {
        method: "eth_subscribe",
        params: ['newHeads']
    },
    secondResult: true,
    secondPayload: {
        method: "eth_unsubscribe"
    },
    dataCount: 1,
    subscriptions: [{
        subscription: '0x1234',
        result: {
            difficulty: "0x15d9223a23aa",
            totalDifficulty: "0x15d9223a23aa",
            extraData: "0xd983010305844765746887676f312e342e328777696e646f7773",
            gasLimit: "0x47e7c4",
            gasUsed: "0x38658",
            hash: "0x950427f707bf395fda0092d4f5dcbcf32d632106fb08e397124d0726082693e6",
            logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            miner: "0xf8b483dba2c3b7176a3da549ad41a48bb3121069",
            nonce: "0x084149998194cc5f",
            number: "0x1348c9",
            size: "0x0",
            parentHash: "0x7736fab79e05dc611604d22470dadad26f56fe494421b5b333de816ce1f25701",
            receiptRoot: "0x2fab35823ad00c7bb388595cb46652fe7886e00660a01e867824d3dceb1c8d36",
            sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
            stateRoot: "0xb3346685172db67de536d8765c43c31009d0eb3bd9c501c9be3229203f15f378",
            timestamp: "0x56ffeff8",
            transactionsRoot: "0x0167ffa60e3ebc0b080cdb95f7c0087dd6c0e61413140e39d94d3468d7c9689f"
        }
    }],
    subscriptionResults: [{
        difficulty: "24022326322090",
        totalDifficulty: "24022326322090",
        extraData: "0xd983010305844765746887676f312e342e328777696e646f7773",
        gasLimit: 4712388,
        gasUsed: 231000,
        hash: "0x950427f707bf395fda0092d4f5dcbcf32d632106fb08e397124d0726082693e6",
        logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        miner: "0xf8b483DbA2c3B7176a3Da549ad41A48BB3121069", // checksum address
        nonce: "0x084149998194cc5f",
        number: 1263817,
        parentHash: "0x7736fab79e05dc611604d22470dadad26f56fe494421b5b333de816ce1f25701",
        receiptRoot: "0x2fab35823ad00c7bb388595cb46652fe7886e00660a01e867824d3dceb1c8d36",
        sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
        stateRoot: "0xb3346685172db67de536d8765c43c31009d0eb3bd9c501c9be3229203f15f378",
        timestamp: 1459613688,
        transactionsRoot: "0x0167ffa60e3ebc0b080cdb95f7c0087dd6c0e61413140e39d94d3468d7c9689f",
        size: 0
    }]
},
    // PENDING TRANSACTIONS
{
    protocol: 'eth',
    args: ['pendingTransactions'],
    firstResult: '0x1234',
    firstPayload: {
        method: "eth_subscribe",
        params: ['newPendingTransactions']
    },
    secondResult: true,
    secondPayload: {
        method: "eth_unsubscribe"
    },
    dataCount: 1,
    subscriptions: [{
        subscription: '0x1234',
        result: "0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b"
    }],
    subscriptionResults: ["0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b"]
},
    // LOGS
{
    protocol: 'eth',
    args: ['logs',{}],
    firstResult: '0x4444',
    firstPayload: {
        method: "eth_subscribe",
        params: ['logs',{topics: []}]
    },
    secondResult: true,
    secondPayload: {
        method: "eth_unsubscribe"
    },
    subscriptions: [{
        subscription: '0x4444',
        result: {
            logIndex: '0x23',
            transactionHash: '0x2345fdfdf',
            blockHash: '0x43534ffddd',
            transactionIndex: '0x1',
            blockNumber: '0x3222',
            address: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
            topics: [
                '0x0000000000000000000000000000000000000000000000000000000005656565'
            ],
            data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
            '0000000000000000000000000000000000000000000000000000000000000008'
        }
    }],
    subscriptionResults: [{
        id: "log_d43624aa",
        blockHash: "0x43534ffddd",
        blockNumber: 12834,
        logIndex: 35,
        transactionHash: '0x2345fdfdf',
        transactionIndex: 1,
        address: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // checksum address
        topics: [
            '0x0000000000000000000000000000000000000000000000000000000005656565'
        ],
        data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
        '0000000000000000000000000000000000000000000000000000000000000008'
    }]
},
{
    protocol: 'eth',
    args: ['logs',{address: ['0xDdf4d0A3c12e86b4B5f39B213f7E19d048276dAE','0xAaf4D0a3C12e86B4B5f39b213f7E19d048276daE']}],
    firstResult: '0x4444',
    firstPayload: {
        method: "eth_subscribe",
        params: ['logs',{address: ['0xddf4d0a3c12e86b4b5f39b213f7e19d048276dae','0xaaf4d0a3c12e86b4b5f39b213f7e19d048276dae'], topics: []}]
    },
    secondResult: true,
    secondPayload: {
        method: "eth_unsubscribe"
    },
    subscriptions: [{
        subscription: '0x4444',
        result: {
            logIndex: '0x23',
            transactionHash: '0x2345fdfdf',
            blockHash: '0x43534ffddd',
            transactionIndex: '0x1',
            blockNumber: '0x3222',
            address: '0xddf4d0a3c12e86b4b5f39b213f7e19d048276dae',
            topics: [
                '0x0000000000000000000000000000000000000000000000000000000005656565'
            ],
            data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
            '0000000000000000000000000000000000000000000000000000000000000008'
        }
    }],
    subscriptionResults: [{
        id: "log_d43624aa",
        blockHash: "0x43534ffddd",
        blockNumber: 12834,
        logIndex: 35,
        transactionHash: '0x2345fdfdf',
        transactionIndex: 1,
        address: '0xDdf4d0A3c12e86b4B5f39B213f7E19d048276dAE', // checksum address
        topics: [
            '0x0000000000000000000000000000000000000000000000000000000005656565'
        ],
        data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
        '0000000000000000000000000000000000000000000000000000000000000008'
    }]
},
    {
        protocol: 'eth',
        args: ['logs',{address: ['0xDdf4d0A3c12e86b4B5f39B213f7E19d048276dAE','0xAaf4D0a3C12e86B4B5f39b213f7E19d048276daE']}],
        firstResult: '0x4444',
        firstPayload: {
            method: "eth_subscribe",
            params: ['logs',{address: ['0xddf4d0a3c12e86b4b5f39b213f7e19d048276dae','0xaaf4d0a3c12e86b4b5f39b213f7e19d048276dae'], topics: []}]
        },
        secondResult: true,
        secondPayload: {
            method: "eth_unsubscribe"
        },
        subscriptions: [{
            subscription: '0x4444',
            result: [{
                logIndex: '0x23',
                transactionHash: '0x2345fdfdf',
                blockHash: '0x43534ffddd',
                transactionIndex: '0x1',
                blockNumber: '0x3222',
                address: '0xddf4d0a3c12e86b4b5f39b213f7e19d048276dae',
                topics: [
                    '0x0000000000000000000000000000000000000000000000000000000005656565'
                ],
                data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                '0000000000000000000000000000000000000000000000000000000000000008'
            },{
                logIndex: '0x23',
                transactionHash: '0x2345fdfdd',
                blockHash: '0x43534ffddd',
                transactionIndex: '0x1',
                blockNumber: '0x3222',
                address: '0xddf4d0a3c12e86b4b5f39b213f7e19d048276dae',
                topics: [
                    '0x0000000000000000000000000000000000000000000000000000000005656565'
                ],
                data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                '0000000000000000000000000000000000000000000000000000000000000008'
            }]
        }],
        subscriptionResults: [{
            id: "log_d43624aa",
            blockHash: "0x43534ffddd",
            blockNumber: 12834,
            logIndex: 35,
            transactionHash: '0x2345fdfdf',
            transactionIndex: 1,
            address: '0xDdf4d0A3c12e86b4B5f39B213f7E19d048276dAE', // checksum address
            topics: [
                '0x0000000000000000000000000000000000000000000000000000000005656565'
            ],
            data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
            '0000000000000000000000000000000000000000000000000000000000000008'
        },{
            id: "log_b20551f9",
            blockHash: "0x43534ffddd",
            blockNumber: 12834,
            logIndex: 35,
            transactionHash: '0x2345fdfdd',
            transactionIndex: 1,
            address: '0xDdf4d0A3c12e86b4B5f39B213f7E19d048276dAE', // checksum address
            topics: [
                '0x0000000000000000000000000000000000000000000000000000000005656565'
            ],
            data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
            '0000000000000000000000000000000000000000000000000000000000000008'
        }]
    },
{
    protocol: 'eth',
    args: ['logs',{address: ['0xDdf4d0A3c12e86b4B5f39B213f7E19d048276dAE','0xAaf4D0a3C12e86B4B5f39b213f7E19d048276daE']}],
    firstResult: '0x4444',
    firstPayload: {
        method: "eth_subscribe",
        params: ['logs',{address: ['0xddf4d0a3c12e86b4b5f39b213f7e19d048276dae','0xaaf4d0a3c12e86b4b5f39b213f7e19d048276dae'], topics: []}]
    },
    secondResult: true,
    secondPayload: {
        method: "eth_unsubscribe"
    },
    subscriptions: [{
        subscription: '0x4444',
        result: [{
            logIndex: '0x23',
            transactionHash: '0x2345fdfdf',
            blockHash: '0x43534ffddd',
            transactionIndex: '0x1',
            blockNumber: '0x3222',
            address: '0xddf4d0a3c12e86b4b5f39b213f7e19d048276dae',
            topics: [
                '0x0000000000000000000000000000000000000000000000000000000005656565'
            ],
            data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
            '0000000000000000000000000000000000000000000000000000000000000008'
        },{
            logIndex: '0x23',
            transactionHash: '0x2345fdfdd',
            blockHash: '0x43534ffddd',
            transactionIndex: '0x1',
            blockNumber: '0x3222',
            address: '0xddf4d0a3c12e86b4b5f39b213f7e19d048276dae',
            topics: [
                '0x0000000000000000000000000000000000000000000000000000000005656565'
            ],
            data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
            '0000000000000000000000000000000000000000000000000000000000000008'
        }]
    }],
    subscriptionResults: [{
        id: "log_d43624aa",
        blockHash: "0x43534ffddd",
        blockNumber: 12834,
        logIndex: 35,
        transactionHash: '0x2345fdfdf',
        transactionIndex: 1,
        address: '0xDdf4d0A3c12e86b4B5f39B213f7E19d048276dAE', // checksum address
        topics: [
            '0x0000000000000000000000000000000000000000000000000000000005656565'
        ],
        data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
        '0000000000000000000000000000000000000000000000000000000000000008'
    },{
        id: "log_b20551f9",
        blockHash: "0x43534ffddd",
        blockNumber: 12834,
        logIndex: 35,
        transactionHash: '0x2345fdfdd',
        transactionIndex: 1,
        address: '0xDdf4d0A3c12e86b4B5f39B213f7E19d048276dAE', // checksum address
        topics: [
            '0x0000000000000000000000000000000000000000000000000000000005656565'
        ],
        data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
        '0000000000000000000000000000000000000000000000000000000000000008'
    }]
},
{
    protocol: 'eth',
    args: ['logs',{address: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', topics: ['0x23']}], // checksum address
    firstResult: '0x555',
    firstPayload: {
        method: "eth_subscribe",
        params: ['logs',{address: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae', topics: ['0x23']}]
    },
    secondResult: true,
    secondPayload: {
        method: "eth_unsubscribe"
    },
    dataCount: 1,
    subscriptions: [{
        subscription: '0x555',
        result: {
            logIndex: '0x23',
            transactionHash: '0x2345fdfdf',
            blockHash: '0x43534ffddd',
            transactionIndex: '0x1',
            blockNumber: '0x3222',
            address: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
            topics: [
                '0x0000000000000000000000000000000000000000000000000000000005656565'
            ],
            data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
            '0000000000000000000000000000000000000000000000000000000000000008'
        }
    }],
    subscriptionResults: [{
        id: "log_d43624aa",
        blockHash: "0x43534ffddd",
        blockNumber: 12834,
        logIndex: 35,
        transactionHash: '0x2345fdfdf',
        transactionIndex: 1,
        address: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // checksum address
        topics: [
            '0x0000000000000000000000000000000000000000000000000000000005656565'
        ],
        data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
        '0000000000000000000000000000000000000000000000000000000000000008'
    }]
},
{
    protocol: 'eth',
    args: ['logs',{address: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae', topics: ['0x23']}],
    firstResult: '0x5556666',
    firstPayload: {
        method: "eth_subscribe",
        params: ['logs',{address: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae', topics: ['0x23']}]
    },
    secondResult: true,
    secondPayload: {
        method: "eth_unsubscribe"
    },
    dataCount: 1,
    changedCount: 1,
    subscriptions: [{
        subscription: '0x5556666',
        result: {
            logIndex: '0x23',
            transactionHash: '0x2345fdfdf',
            blockHash: '0x43534ffddd',
            transactionIndex: '0x1',
            blockNumber: '0x3222',
            address: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
            topics: [
                '0x0000000000000000000000000000000000000000000000000000000005656565'
            ],
            data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
            '0000000000000000000000000000000000000000000000000000000000000008'
        }
    },{
        subscription: '0x5556666',
        result: {
            logIndex: '0x23',
            transactionHash: '0x2345fdfdf',
            blockHash: '0x43534ffddd',
            removed: true,
            transactionIndex: '0x1',
            blockNumber: '0x3222',
            address: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
            topics: [
                '0x0000000000000000000000000000000000000000000000000000000005656565'
            ],
            data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
            '0000000000000000000000000000000000000000000000000000000000000008'
        }
    }],
    subscriptionResults: [{
        id: "log_d43624aa",
        blockHash: "0x43534ffddd",
        blockNumber: 12834,
        logIndex: 35,
        transactionHash: '0x2345fdfdf',
        transactionIndex: 1,
        address: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // checksum address
        topics: [
            '0x0000000000000000000000000000000000000000000000000000000005656565'
        ],
        data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
        '0000000000000000000000000000000000000000000000000000000000000008'
    },{
        id: "log_d43624aa",
        blockHash: "0x43534ffddd",
        blockNumber: 12834,
        removed: true,
        logIndex: 35,
        transactionHash: '0x2345fdfdf',
        transactionIndex: 1,
        address: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // checksum address
        topics: [
            '0x0000000000000000000000000000000000000000000000000000000005656565'
        ],
        data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
        '0000000000000000000000000000000000000000000000000000000000000008'
    }]
},
    // SYNCING
{
    protocol: 'eth',
    args: ['syncing'],
    firstResult: '0x666666',
    firstPayload: {
        method: "eth_subscribe",
        params: ['syncing']
    },
    secondResult: true,
    secondPayload: {
        method: "eth_unsubscribe"
    },
    dataCount: 2,
    changedCount: 2,
    subscriptions: [{
            subscription: '0x666666',
            result: {
                startingBlock: '0xbff23',
                currentBlock: '0xbff11',
                highestBlock: '0xadf23',
                knownStates: '0xaaa23',
                pulledStates: '0x23'
            }
        },{
            subscription: '0x666666',
            result: {
                startingBlock: '0xbff23',
                currentBlock: '0xbff11',
                highestBlock: '0xbff11',
                knownStates: '0xaaa23',
                pulledStates: '0x23'
            }
        }
    ],
    subscriptionResults: [
        true,
        {
            startingBlock: 786211,
            currentBlock: 786193,
            highestBlock: 712483,
            knownStates: 698915,
            pulledStates: 35
        },
        {
            startingBlock: 786211,
            currentBlock: 786193,
            highestBlock: 786193,
            knownStates: 698915,
            pulledStates: 35
        },
        false
    ]
}];


testSubscription.runTests('eth', tests);

