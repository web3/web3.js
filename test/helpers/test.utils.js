var chai = require('chai');
var assert = chai.assert;
//var web3 = require('../../index');

var FakeHttpProvider = require('./FakeIpcProvider');

var methodExists = function (object, method) {
    it('should have method ' + method + ' implemented', function() {
        //web3.setProvider(null);
        assert.equal('function', typeof object[method], 'method ' + method + ' is not implemented');
    });
};

var propertyExists = function (object, property) {
    it('should have property ' + property + ' implemented', function() {
        // set dummy providor, to prevent error
        // web3.setProvider(new FakeHttpProvider());
        assert.notEqual('undefined', typeof object[property], 'property ' + property + ' is not implemented');
    });
};

// Runs a noop transaction to move instamine forward
// Useful for confirmation handler testing.
var mine = async function(web3, account) {
    await web3.eth.sendTransaction({
        from: account,
        to: account,
        gasPrice: '1',
        gas: 4000000,
        value: web3.utils.toWei('0', 'ether'),
    });
}

// Extracts a receipt object from 1.x error message
var extractReceipt = function(message){
    const receiptString = message.split("the EVM:")[1].trim();
    return JSON.parse(receiptString);
}

module.exports = {
    methodExists: methodExists,
    propertyExists: propertyExists,
    mine: mine,
    extractReceipt: extractReceipt,
};

