var chai = require('chai');
var assert = chai.assert;
var SolidityEvent = require('../lib/web3/event');

var tests = [{
    abi: {
        name: 'event1',
        inputs: []
    },
    address: '0x1234567890123456789012345678901234567890',
    signature: 'ffff',
    indexed: {},
    options: {},
    expected: {
        address: '0x1234567890123456789012345678901234567890',
        topics: [
            '0xffff'
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
    address: '0x1234567890123456789012345678901234567890',
    signature: 'ffff',
    indexed: {
        a: 16
    },
    options: {},
    expected: {
        address: '0x1234567890123456789012345678901234567890',
        topics: [
            '0xffff',
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
    address: '0x1234567890123456789012345678901234567890',
    signature: 'ffff',
    indexed: {
        b: 4
    },
    options: {},
    expected: {
        address: '0x1234567890123456789012345678901234567890',
        topics: [
            '0xffff', // signature
            null, // a
            '0x0000000000000000000000000000000000000000000000000000000000000004', // b
            null // d
        ]
    }

}];

describe('lib/web3/event', function () {
    describe('encode', function () {
        tests.forEach(function (test, index) {
            it('test no: ' + index, function () {
                var event = new SolidityEvent(test.abi, test.address);
                event.signature = function () { // inject signature
                    return test.signature;
                };

                var result = event.encode(test.indexed, test.options);
                assert.deepEqual(result, test.expected);
            });
        });
    });
});

