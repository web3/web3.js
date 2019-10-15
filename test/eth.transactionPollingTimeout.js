var chai = require('chai');
var assert = chai.assert;
var Eth = require('../packages/web3-eth');

var eth = new Eth();

var setValue = 123;

describe('web3.eth', function () {
    describe('transactionPollingTimeout', function () {
        it('should check if transactionPollingTimeout is set to proper value', function () {
            assert.equal(eth.transactionPollingTimeout, 750);
            assert.equal(eth.Contract.transactionPollingTimeout, 750);
            assert.equal(eth.getCode.method.transactionPollingTimeout, 750);
        });
        it('should set transactionPollingTimeout for all sub packages is set to proper value, if Eth package is changed', function () {
            eth.transactionPollingTimeout = setValue;

            assert.equal(eth.transactionPollingTimeout, setValue);
            assert.equal(eth.Contract.transactionPollingTimeout, setValue);
            assert.equal(eth.getCode.method.transactionPollingTimeout, setValue);
        });
    });
});

