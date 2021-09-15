var chai = require('chai');
var assert = chai.assert;
var Eth = require('web3-eth');

var eth = new Eth();

var setValue = 123;

describe('web3.eth', function () {
    describe('blockHeaderTimeout', function () {
        it('should check if blockHeaderTimeout is set to proper value', function () {
            assert.equal(eth.blockHeaderTimeout, 5);
            assert.equal(eth.Contract.blockHeaderTimeout, 5);
            assert.equal(eth.getCode.method.blockHeaderTimeout, 5);
        });
        it('should set blockHeaderTimeout for all sub packages is set to proper value, if Eth package is changed', function () {
            eth.blockHeaderTimeout = setValue;

            assert.equal(eth.blockHeaderTimeout, setValue);
            assert.equal(eth.Contract.blockHeaderTimeout, setValue);
            assert.equal(eth.getCode.method.blockHeaderTimeout, setValue);
        });
    });
});

