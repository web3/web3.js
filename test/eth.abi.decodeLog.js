var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../packages/web3');
var web3 = new Web3();

var tests = [{
    params: [[{
        type: 'string',
        name: 'myString'
    },{
        type: 'uint256',
        name: 'myNumber',
        indexed: true
    },{
        type: 'uint8',
        name: 'mySmallNumber',
        indexed: true
    }], '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000748656c6c6f252100000000000000000000000000000000000000000000000000',
    ['0x000000000000000000000000000000000000000000000000000000000000f310', '0x0000000000000000000000000000000000000000000000000000000000000010']],
    result: {
        '0': 'Hello%!',
        '1': '62224',
        '2': '16',
        myString: 'Hello%!',
        myNumber: '62224',
        mySmallNumber: '16',
        "__length__": 3
    }
},{
    params: [[{
        type: 'bytes',
        name: 'HelloBytes'
    },{
        type: 'uint8',
        name: 'myNumber',
        indexed: true
    }], '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000748656c6c6f252100000000000000000000000000000000000000000000000000',
        ['0x000000000000000000000000000000000000000000000000000000000000f310', '0x0000000000000000000000000000000000000000000000000000000000000010']],
    result: {
        '0': '0x48656c6c6f2521',
        '1': '62224',
        HelloBytes: '0x48656c6c6f2521',
        myNumber: '62224',
        "__length__": 2
    }
}];

describe('decodeLog', function () {
    tests.forEach(function (test) {
        it('should convert correctly', function () {
            assert.deepEqual(web3.eth.abi.decodeLog.apply(web3.eth.abi, test.params), test.result);
        });
    });
});
