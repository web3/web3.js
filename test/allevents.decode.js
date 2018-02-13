var chai = require('chai');
var assert = chai.assert;
var BigNumber = require('bignumber.js');
var AllSolidityEvents = require('../lib/web3/allevents');
var Web3 = require('../index');


var name = 'event1';
var address = '0x1234567890123456789012345678901234567890';

var tests = [{
    abi: [{
        name: name,
        type: 'event',
        inputs: [{
            name: 'a',
            type: 'int',
            indexed: false
        }]
    }],
    data: {
        logIndex: '0x1',
        transactionIndex: '0x10',
        transactionHash: '0x1234567890',
        address: address,
        blockHash: '0x1234567890',
        blockNumber: '0x1',
        data: '0x' +
            '0000000000000000000000000000000000000000000000000000000000000001' +
            '0000000000000000000000000000000000000000000000000000000000000004',
        topics: undefined,
    },
    expected: {
        logIndex: 1,
        transactionIndex: 16,
        transactionHash: '0x1234567890',
        address: address,
        blockHash: '0x1234567890',
        blockNumber: 1,
        data: '0x' +
            '0000000000000000000000000000000000000000000000000000000000000001' +
            '0000000000000000000000000000000000000000000000000000000000000004',
        topics: undefined,
    }
}, {
    abi: [{
        name: name,
        type: 'event',
        anonymous: true,
        inputs: [{
            name: 'a',
            type: 'int',
            indexed: false
        }]
    }],
    data: {
        logIndex: '0x1',
        transactionIndex: '0x10',
        transactionHash: '0x1234567890',
        address: address,
        blockHash: '0x1234567890',
        blockNumber: '0x1',
        data: '0x' +
            '0000000000000000000000000000000000000000000000000000000000000001' +
            '0000000000000000000000000000000000000000000000000000000000000004',
        topics: [],
    },
    expected: {
        logIndex: 1,
        transactionIndex: 16,
        transactionHash: '0x1234567890',
        address: address,
        blockHash: '0x1234567890',
        blockNumber: 1,
        data: '0x' +
            '0000000000000000000000000000000000000000000000000000000000000001' +
            '0000000000000000000000000000000000000000000000000000000000000004',
        topics: [],
    }
}, {
    abi: [{
        name: name,
        type: 'event',
        inputs: [{
            name: 'a',
            type: 'int',
            indexed: false
        }, {
            name: 'b',
            type: 'int',
            indexed: true
        }, {
            name: 'c',
            type: 'int',
            indexed: false
        }, {
            name: 'd',
            type: 'int',
            indexed: true
        }]
    }],
    data: {
        logIndex: '0x1',
        transactionIndex: '0x10',
        transactionHash: '0x1234567890',
        address: address,
        blockHash: '0x1234567890',
        blockNumber: '0x1',
        data: '0x' +
            '0000000000000000000000000000000000000000000000000000000000000001' +
            '0000000000000000000000000000000000000000000000000000000000000004',
        topics: [
            '0x0e99121e9409665e680573fa7da0cb6651dbdcf10c95f585b92b2c9b9702cff9',
            '0x0000000000000000000000000000000000000000000000000000000000000010'
        ]
    },
    expected: {
        event: name,
        args: {
            a: new BigNumber(1),
            b: new BigNumber(16),
            c: new BigNumber(4),
            d: new BigNumber(0)
        },
        logIndex: 1,
        transactionIndex: 16,
        transactionHash: '0x1234567890',
        address: address,
        blockHash: '0x1234567890',
        blockNumber: 1
    }
}];

describe('lib/web3/allevents', function () {
    describe('decode', function () {
        tests.forEach(function (test, index) {
            it('test no: ' + index, function () {
                var web3 = new Web3();
                var allEvents = new AllSolidityEvents(web3, test.abi, address);

                var result = allEvents.decode(test.data);
                assert.deepEqual(result, test.expected);
            });
        });
    });
});

