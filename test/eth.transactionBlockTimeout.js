var chai = require('chai');
var assert = chai.assert;
var Eth = require('../packages/web3-eth');

var eth = new Eth();

var setValue = 123;

describe('web3.eth', function () {
    describe('transactionBlockTimeout', function () {
        it('should check if transactionBlockTimeout is set to proper value', function () {
            assert.equal(eth.transactionBlockTimeout, 50);
            assert.equal(eth.Contract.transactionBlockTimeout, 50);
            assert.equal(eth.getCode.method.transactionBlockTimeout, 50);
        });
        it('should set transactionBlockTimeout for all sub packages is set to proper value, if Eth package is changed', function () {
            eth.transactionBlockTimeout = setValue;

            assert.equal(eth.transactionBlockTimeout, setValue);
            assert.equal(eth.Contract.transactionBlockTimeout, setValue);
            assert.equal(eth.getCode.method.transactionBlockTimeout, setValue);
        });
    });
});

