var chai = require('chai');
var assert = chai.assert;
var Eth = require('../packages/web3-eth/');


var name = 'event1';
var address = '0xffddb67890123456789012345678901234567890';
var resultAddress = '0xffdDb67890123456789012345678901234567890';

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
        signature: null,
        returnValues: {},
        logIndex: 1,
        transactionIndex: 16,
        transactionHash: '0x1234567890',
        address: resultAddress,
        blockHash: '0x1234567890',
        blockNumber: 1,
        id: "log_c71f2e84",
        raw: {
            topics: [],
            data: ''
        }
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
        signature: null,
        returnValues: {
            0: '1',
            a: '1'
        },
        logIndex: 1,
        transactionIndex: 16,
        transactionHash: '0x1234567890',
        address: resultAddress,
        blockHash: '0x1234567890',
        blockNumber: 1,
        id: "log_c71f2e84",
        raw: {
            data: "0x0000000000000000000000000000000000000000000000000000000000000001",
            topics: []
        }
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
        signature: address,
        returnValues: {
            0: '1',
            1: '10',
            2: '4',
            3: '16',
            a: '1',
            b: '10',
            c: '4',
            d: '16'
        },
        logIndex: 1,
        transactionIndex: 16,
        transactionHash: '0x1234567890',
        address: resultAddress,
        blockHash: '0x1234567890',
        blockNumber: 1,
        id: "log_c71f2e84",
        raw: {
            data: '0x' +
            '0000000000000000000000000000000000000000000000000000000000000001' +
            '0000000000000000000000000000000000000000000000000000000000000004',
            topics: [
                address,
                '0x000000000000000000000000000000000000000000000000000000000000000a',
                '0x0000000000000000000000000000000000000000000000000000000000000010'
            ]
        }
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
        address: resultAddress,
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
        signature: null,
        returnValues: {
            0: '1',
            1: '10',
            2: '4',
            3: '16',
            a: '1',
            b: '10',
            c: '4',
            d: '16'
        },
        logIndex: 1,
        transactionIndex: 16,
        transactionHash: '0x1234567890',
        address: resultAddress,
        blockHash: '0x1234567890',
        blockNumber: 1,
        id: "log_c71f2e84",
        raw: {
            data: '0x' +
            '0000000000000000000000000000000000000000000000000000000000000001' +
            '0000000000000000000000000000000000000000000000000000000000000004',
            topics: [
                '0x000000000000000000000000000000000000000000000000000000000000000a',
                '0x0000000000000000000000000000000000000000000000000000000000000010'
            ]
        }
    }
}];

describe('lib/web3/event', function () {
    describe('decode', function () {
        tests.forEach(function (test, index) {
            it('test no: ' + index, function () {
                var eth = new Eth();
                var contract = new eth.Contract([test.abi], address);

                var result = contract._decodeEventABI.call(test.abi, test.data);
                assert.deepEqual(result, test.expected);
            });
        });
    });
});

