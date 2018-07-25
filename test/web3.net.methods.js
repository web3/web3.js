var chai = require('chai');
var assert = chai.assert; 
var Web3 = require('../index.js');
var web3 = new Web3();
var u = require('./helpers/test.utils.js');
var FakeHttpProvider = require('./helpers/FakeHttpProvider');

describe('web3.net', function() {
    describe('methods', function() {
        // set dummy providor, to prevent error
        web3.setProvider(new FakeHttpProvider());

        u.propertyExists(web3.net, 'listening');
        u.propertyExists(web3.net, 'peerCount');
    });
});
