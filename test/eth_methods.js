var chai = require('chai');
var assert = chai.assert;
var u = require('./helpers/test.utils.js');

var Eth = require('../packages/web3-eth');
var eth = new Eth();

describe('eth', function() {
    describe('methods', function() {
        u.methodExists(eth, 'getBalance');
        u.methodExists(eth, 'getStorageAt');
        u.methodExists(eth, 'getTransactionCount');
        u.methodExists(eth, 'getCode');
        u.methodExists(eth, 'isSyncing');
        u.methodExists(eth, 'sendTransaction');
        u.methodExists(eth, 'call');
        u.methodExists(eth, 'getBlock');
        u.methodExists(eth, 'getTransaction');
        u.methodExists(eth, 'getUncle');
        u.methodExists(eth, 'getBlockTransactionCount');
        u.methodExists(eth, 'getBlockUncleCount');
        u.methodExists(eth, 'subscribe');
        u.methodExists(eth, 'Contract');
        u.methodExists(eth, 'Iban');
        u.methodExists(eth, 'getChainId')

        u.methodExists(eth, 'isMining');
        u.methodExists(eth, 'getCoinbase');
        u.methodExists(eth, 'getGasPrice');
        u.methodExists(eth, 'getFeeHistory');
        u.methodExists(eth, 'getHashrate');
        u.methodExists(eth, 'getAccounts');
        u.methodExists(eth, 'getBlockNumber');

        u.methodExists(eth, 'getProtocolVersion');

        u.methodExists(eth, 'setProvider');
        u.propertyExists(eth, 'givenProvider');
        u.propertyExists(eth, 'defaultBlock');
        u.propertyExists(eth, 'defaultAccount');

        u.propertyExists(eth, 'net');
        u.methodExists(eth.net, 'getId');
        u.methodExists(eth.net, 'isListening');
        u.methodExists(eth.net, 'getPeerCount');

        u.propertyExists(eth, 'personal');
        u.methodExists(eth.personal, 'sendTransaction');
        u.methodExists(eth.personal, 'newAccount');
        u.methodExists(eth.personal, 'unlockAccount');
    });
});

