var chai = require('chai');
var assert = chai.assert;
var Eth = require('../packages/web3-eth');

var eth = new Eth();

var setValue = 123;

describe('web3.eth', function () {
    describe('transactionPollingInterval', function () {
        it('should check if transactionPollingInterval is set to proper value', function () {
            assert.equal(eth.transactionPollingInterval, 1000);
            assert.equal(eth.Contract.transactionPollingInterval, 1000);
            assert.equal(eth.getCode.method.transactionPollingInterval, 1000);
        });
        it('should set transactionPollingInterval for all sub packages is set to proper value, if Eth package is changed', function () {
            eth.transactionPollingInterval = setValue;

            assert.equal(eth.transactionPollingInterval, setValue);
            assert.equal(eth.Contract.transactionPollingInterval, setValue);
            assert.equal(eth.getCode.method.transactionPollingInterval, setValue);
        });
    });
});

