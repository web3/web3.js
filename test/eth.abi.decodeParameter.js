var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../packages/web3');
var web3 = new Web3();

var tests = [{
    params: ['uint256', '0x0000000000000000000000000000000000000000000000000000000000000010'],
    result: "16"
},{
    params: ['string', '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000'],
    result: "Hello!%!"
}];

describe('decodeParameter', function () {
    tests.forEach(function (test) {
        it('should convert correctly', function () {
            assert.equal(web3.eth.abi.decodeParameter.apply(web3.eth.abi, test.params), test.result);
        });
    });
});
