var chai = require('chai');
var assert = chai.assert;
var SolidityEvent = require('../lib/web3/event');

var address = '0x1234567890123456789012345678901234567890';
var signature = '0xffff';

var tests = [{
    abi: {
        name: 'event1',
        inputs: []
    },
    indexed: {},
    options: {},
    expected: {
        address: address,
        topics: [
            signature
        ]
    }
}, {
    abi: {
        name: 'event1',
        inputs: [{
            type: 'int',
            name: 'a',
            indexed: true
        }]
    },
    indexed: {
        a: 16
    },
    options: {},
    expected: {
        address: address,
        topics: [
            signature,
            '0x0000000000000000000000000000000000000000000000000000000000000010'
        ]
    }
},{
    abi: {
        name: 'event1',
        inputs: [{
            type: 'int',
            name: 'a',
            indexed: true
        }, {
            type: 'int',
            name: 'b',
            indexed: true
        }, {
            type: 'int',
            name: 'c',
            indexed: false
        }, {
            type: 'int',
            name: 'd',
            indexed: true
        }]
    },
    indexed: {
        b: 4
    },
    options: {},
    expected: {
        address: address,
        topics: [
            signature, // signature
            null, // a
            '0x0000000000000000000000000000000000000000000000000000000000000004', // b
            null // d
        ]
    }
}, {
    abi: {
        name: 'event1',
        inputs: [{
            type: 'int',
            name: 'a',
            indexed: true
        }, {
            type: 'int',
            name: 'b',
            indexed: true
        }]
    },
    indexed: {
        a: [16, 1],
        b: 2
    },
    options: {},
    expected: {
        address: address,
        topics: [
            signature,
            ['0x0000000000000000000000000000000000000000000000000000000000000010', '0x0000000000000000000000000000000000000000000000000000000000000001'],
            '0x0000000000000000000000000000000000000000000000000000000000000002'
        ]
    }
}, {
    abi: {
        name: 'event1',
        inputs: [{
            type: 'int',
            name: 'a',
            indexed: true
        }]
    },
    indexed: {
        a: null
    },
    options: {},
    expected: {
        address: address,
        topics: [
            signature,
            null
        ]
    }
}];

describe('lib/web3/event', function () {
    describe('encode', function () {
        tests.forEach(function (test, index) {
            it('test no: ' + index, function () {
                var event = new SolidityEvent(test.abi, address);
                event.signature = function () { // inject signature
                    return signature.slice(2);
                };

                var result = event.encode(test.indexed, test.options);
                assert.deepEqual(result, test.expected);
            });
        });
    });
});

