var chai = require('chai');
var assert = chai.assert;
var SolidityEvent = require('../lib/web3/events');
var Web3 = require('../index');


var address = '0x1234567890123456789012345678901234567890';
var signature = '0xffff';

var tests = [{
    abi: {
        name: 'event1',
        inputs: []
    },
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
    options: {
        filter: {
            a: 16
        },
    },
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
    options: {
        filter: {
            b: 4
        }
    },
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
    options: {
        filter: {
            a: [16, 1],
            b: 2
        }
    },
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
    options: {
        filter: {
            a: null
        }
    },
    expected: {
        address: address,
        topics: [
            signature,
            null
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
    options: {
        filter: {
            a: 1
        },
        fromBlock: 'latest',
        toBlock: 'pending'
    },
    expected: {
        address: address,
        fromBlock: 'latest',
        toBlock: 'pending',
        topics: [
            signature,
            '0x0000000000000000000000000000000000000000000000000000000000000001'
        ]
    }
},
{
    abi: {
        name: 'event1',
        inputs: [{
            type: 'int',
            name: 'a',
            indexed: true
        }]
    },
    options: {
        filter: {
            a: 1
        },
        fromBlock: 4,
        toBlock: 10
    },
    expected: {
        address: address,
        fromBlock: '0x4',
        toBlock: '0xa',
        topics: [
            signature,
            '0x0000000000000000000000000000000000000000000000000000000000000001'
        ]
    }
}, {
    abi: {
        name: 'event1',
        inputs: [{
            type: 'int',
            name: 'a',
            indexed: true
        }],
        anonymous: true
    },
    options: {
        filter: {
            a: 1
        }
    },
    expected: {
        address: address,
        topics: [
            '0x0000000000000000000000000000000000000000000000000000000000000001'
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
        }],
        anonymous: true
    },
    options: {
        filter: {
            b: 1
        }
    },
    expected: {
        address: address,
        topics: [
            null,
            '0x0000000000000000000000000000000000000000000000000000000000000001'
        ]
    }
}];

describe('lib/web3/event', function () {
    describe('encode', function () {
        tests.forEach(function (test, index) {
            it('test no: ' + index, function () {
                var web3 = new Web3();
                var event = new SolidityEvent(web3, test.abi, address);
                event.signature = function () { // inject signature
                    return signature.slice(2);
                };

                var result = event.encode(test.options);
                assert.deepEqual(result, test.expected);
            });
        });
    });
});

