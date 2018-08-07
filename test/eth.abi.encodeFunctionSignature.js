var chai = require('chai');
var assert = chai.assert;
var Abi = require('../packages/web3-eth-abi');

var tests = [{
    params: [{
        name: 'myMethod',
        type: 'function',
        inputs: [{
            type: 'uint256',
            name: 'myNumber'
        },{
            type: 'string',
            name: 'myString'
        }]
    }],
    result: '0x24ee0097'
},{
    params: [{
        name: 'myMethod',
        type: 'function',
        inputs: [{
            type: 'string',
            name: 'myNumber'
        },{
            type: 'bytes8',
            name: 'myString'
        }]
    }],
    result: '0x27b00c93'
},{
    params: [{
        name: 'Somthing',
        type: 'function',
        inputs: [{
            type: 'uint16',
            name: 'myNumber'
        },{
            type: 'bytes',
            name: 'myString'
        }]
    }],
    result: '0x724ff7a1'
},{
    params: [{
        name: 'something',
        type: 'function',
        inputs: []
    }],
    result: '0xa7a0d537'
}];

describe('encodeFunctionSignature', function () {
    tests.forEach(function (test) {
        it('should convert correctly', function () {
            assert.equal(Abi.encodeFunctionSignature.apply(Abi, test.params), test.result);
        });
    });
});
