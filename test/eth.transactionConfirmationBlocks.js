var chai = require('chai');
var assert = chai.assert;
var Eth = require('../packages/web3-eth');

var eth = new Eth();

var setValue = 123;

describe('web3.eth', function () {
    describe('transactionConfirmationBlocks', function () {
        it('should check if transactionConfirmationBlocks is set to proper value', function () {
            assert.equal(eth.transactionConfirmationBlocks, 24);
            assert.equal(eth.Contract.transactionConfirmationBlocks, 24);
            assert.equal(eth.getCode.method.transactionConfirmationBlocks, 24);
        });
        it('should set transactionConfirmationBlocks for all sub packages is set to proper value, if Eth package is changed', function () {
            eth.transactionConfirmationBlocks = setValue;

            assert.equal(eth.transactionConfirmationBlocks, setValue);
            assert.equal(eth.Contract.transactionConfirmationBlocks, setValue);
            assert.equal(eth.getCode.method.transactionConfirmationBlocks, setValue);
        });
    });
});

