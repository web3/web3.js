var chai = require('chai');
var assert = chai.assert;
var Abi = require('../packages/web3-eth-abi');

var tests = [{
    params: ['uint256', '2345675643'],
    result: '0x000000000000000000000000000000000000000000000000000000008bd02b7b'
},{
    params: ['bytes32', '0xdf3234'],
    result: '0xdf32340000000000000000000000000000000000000000000000000000000000'
},{
    params: ['bytes32[]', ['0xdf3234', '0xfdfd']],
    result: '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002df32340000000000000000000000000000000000000000000000000000000000fdfd000000000000000000000000000000000000000000000000000000000000'
},{
    params: ['int128', '-170141183460469231731687303715884105727'],
    result: '0xffffffffffffffffffffffffffffffff80000000000000000000000000000001'
}];

describe('encodeParameter', function () {
    tests.forEach(function (test) {
        it('should convert correctly', function () {
            assert.equal(Abi.encodeParameter.apply(Abi, test.params), test.result);
        });
    });
});
