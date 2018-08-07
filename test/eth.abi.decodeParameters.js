var chai = require('chai');
var assert = chai.assert;
var Abi = require('../packages/web3-eth-abi');

var tests = [{
    params: [['string', 'uint256'], '0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000ea000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000'],
    result: {
        '0': 'Hello!%!',
        '1': '234',
        "__length__": 2
    }
},{
    params: [[{
        type: 'string',
        name: 'myString'
    },{
        type: 'uint256',
        name: 'myNumber'
    }], '0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000ea000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000'],
    result: {
        '0': 'Hello!%!',
        '1': '234',
        myString: 'Hello!%!',
        myNumber: '234',
        "__length__": 2
    }
},{
    params: [['string'], '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'],
    result: {'0': "", "__length__": 1}
},{
    params: [['int256'], '0x0000000000000000000000000000000000000000000000000000000000000000'],
    result: {'0': "0", "__length__": 1}
},{
    params: [['uint256'], '0x0000000000000000000000000000000000000000000000000000000000000000'],
    result: {'0': "0", "__length__": 1}
},{
    params: [['bytes'], '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'],
    result: {'0': null, "__length__": 1}
},{
    params: [['address'], '0x0000000000000000000000000000000000000000000000000000000000000000'],
    result: {'0': "0x0000000000000000000000000000000000000000", "__length__": 1}
},{
    params: [['bytes32'], '0x0000000000000000000000000000000000000000000000000000000000000000'],
    result: {'0': "0x0000000000000000000000000000000000000000000000000000000000000000", "__length__": 1}
},{
    params: [['bool'], '0x0000000000000000000000000000000000000000000000000000000000000000'],
    result: {'0': false, "__length__": 1}
}];

describe('decodeParameters', function () {
    tests.forEach(function (test) {
        it('should convert correctly', function () {
            assert.deepEqual(Abi.decodeParameters.apply(Abi, test.params), test.result);
        });
    });
});


var failures = [{
    params: [['string', 'uint256'], '0x']
},{
    params: [[{
        type: 'string',
        name: 'myString'
    },{
        type: 'uint256',
        name: 'myNumber'
    }], '0x']
},{
    params: [['string'], '0x']
},{
    params: [['int256'], '0x']
},{
    params: [['uint256'], '0x']
},{
    params: [['bytes'], '0x']
},{
    params: [['address'], '0x']
},{
    params: [['bytes32'], '0x']
},{
    params: [['bool'], '0x']
}];

describe('decodeParameters', function () {
    failures.forEach(function (test) {
        it('should not convert '+test.params[1]+' to '+test.params[0], function () {
            assert.throws(_ => {Abi.decodeParameters.apply(Abi, test.params)});
        });
    });
});
