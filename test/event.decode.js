var chai = require('chai');
var assert = chai.assert;
var Eth = require('../packages/web3-eth/');


var name = 'event1';
var address = '0x1234567890123456789012345678901234567890';

var tests = [{
    abi: {
        name: name,
        type: 'event',
        inputs: []
    },
    data: {
        logIndex: '0x1',
        transactionIndex: '0x10',
        transactionHash: '0x1234567890',
        address: address,
        blockHash: '0x1234567890',
        blockNumber: '0x1'
    },
    expected: {
        event: name,
        returnValues: {},
        logIndex: 1,
        transactionIndex: 16,
        transactionHash: '0x1234567890',
        address: address,
        blockHash: '0x1234567890',
        blockNumber: 1,
        id: "log_c71f2e84",
        data: '',
        topics: []
    }
}, {
    abi: {
        name: name,
        inputs: [{
            name: 'a',
            type: 'int',
            indexed: false
        }]
    },
    data: {
        logIndex: '0x1',
        transactionIndex: '0x10',
        transactionHash: '0x1234567890',
        address: address,
        blockHash: '0x1234567890',
        blockNumber: '0x1',
        data: '0x0000000000000000000000000000000000000000000000000000000000000001'
    },
    expected: {
        event: name,
        returnValues: {
            a: '1'
        },
        logIndex: 1,
        transactionIndex: 16,
        transactionHash: '0x1234567890',
        address: address,
        blockHash: '0x1234567890',
        blockNumber: 1,
        topics: [],
        data: "0x0000000000000000000000000000000000000000000000000000000000000001",
        id: "log_c71f2e84"
    }
}, {
    abi: {
        name: name,
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
    },
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
            address,
            '0x000000000000000000000000000000000000000000000000000000000000000a',
            '0x0000000000000000000000000000000000000000000000000000000000000010'
        ]
    },
    expected: {
        event: name,
        returnValues: {
            a: '1',
            b: '10',
            c: '4',
            d: '16'
        },
        logIndex: 1,
        transactionIndex: 16,
        transactionHash: '0x1234567890',
        address: address,
        blockHash: '0x1234567890',
        blockNumber: 1,
        id: "log_c71f2e84",
        data: '0x' +
        '0000000000000000000000000000000000000000000000000000000000000001' +
        '0000000000000000000000000000000000000000000000000000000000000004',
        topics: [
            address,
            '0x000000000000000000000000000000000000000000000000000000000000000a',
            '0x0000000000000000000000000000000000000000000000000000000000000010'
        ]
    }
}, {
    abi: {
        name: name,
        anonymous: true,
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
    },
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
            '0x000000000000000000000000000000000000000000000000000000000000000a',
            '0x0000000000000000000000000000000000000000000000000000000000000010'
        ]
    },
    expected: {
        event: name,
        returnValues: {
            a: '1',
            b: '10',
            c: '4',
            d: '16'
        },
        logIndex: 1,
        transactionIndex: 16,
        transactionHash: '0x1234567890',
        address: address,
        blockHash: '0x1234567890',
        blockNumber: 1,
        id: "log_c71f2e84",
        data: '0x' +
        '0000000000000000000000000000000000000000000000000000000000000001' +
        '0000000000000000000000000000000000000000000000000000000000000004',
        topics: [
            '0x000000000000000000000000000000000000000000000000000000000000000a',
            '0x0000000000000000000000000000000000000000000000000000000000000010'
        ]
    }
}];

describe('lib/web3/event', function () {
    describe('decode', function () {
        tests.forEach(function (test, index) {
            it('test no: ' + index, function () {
                var eth = new Eth();
                var contract = new eth.contract([test.abi], address);

                var result = contract._decodeEventABI.call(test.abi, test.data);
                assert.deepEqual(result, test.expected);
            });
        });
    });
});

