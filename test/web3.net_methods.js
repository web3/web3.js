var chai = require('chai');
var assert = chai.assert;
var u = require('./helpers/test.utils.js');
var Net = require('../packages/web3-net');
var net = new Net();

describe('web3.net', function() {
    describe('methods', function() {
        u.methodExists(net, 'isListening');
        u.methodExists(net, 'getPeerCount');
    });
});
