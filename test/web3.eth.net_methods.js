var chai = require('chai');
var assert = chai.assert;
var u = require('./helpers/test.utils.js');
var Eth = require('../packages/web3-eth');
var eth = new Eth();

describe('web3.net', function() {
    describe('methods', function() {
        u.methodExists(eth.net, 'getId');
        u.methodExists(eth.net, 'getNetworkType');
        u.methodExists(eth.net, 'isListening');
        u.methodExists(eth.net, 'getPeerCount');
    });
});
