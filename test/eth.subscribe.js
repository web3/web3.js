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
        result: '0x950427f707bf395fda0092d4f5dcbcf32d632106fb08e397124d0726082693e6'
    }],
    subscriptionResults: ['0x950427f707bf395fda0092d4f5dcbcf32d632106fb08e397124d0726082693e6']
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

