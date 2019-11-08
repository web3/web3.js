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

// Conditionally requires web3:
// loads web3.min when running headless browser tests, the unbuilt web3 otherwise.
var getWeb3 = function(){
    return (global.window)
        ? require('../../packages/web3/dist/web3.min')
        : require('../../packages/web3');
}

// Gets correct websocket port for client. Ganache uses 8545 for both
// http and ws. It's run in e2e.ganache.sh and for all the headless browser tests
var getWebsocketPort = function(){
    return ( process.env.GANACHE || global.window ) ?  8545 : 8546;
}

// Configurable delay
var waitMs = async function(ms=0){
    return new Promise(resolve => setTimeout(() => resolve(), ms))
}

module.exports = {
    methodExists: methodExists,
    propertyExists: propertyExists,
    mine: mine,
    extractReceipt: extractReceipt,
    getWeb3: getWeb3,
    getWebsocketPort: getWebsocketPort,
    waitMs: waitMs
};

