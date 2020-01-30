var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../index.js');
var web3 = new Web3();
var u = require('./helpers/test.utils.js');

describe('web3.shh', function() {
    describe('methods', function() {
        u.methodExists(web3.shh, 'version');
        u.methodExists(web3.shh, 'info');
        u.methodExists(web3.shh, 'setMaxMessageSize');
        u.methodExists(web3.shh, 'setMinPoW');
        u.methodExists(web3.shh, 'markTrustedPeer');
        u.methodExists(web3.shh, 'newKeyPair');
        u.methodExists(web3.shh, 'addPrivateKey');
        u.methodExists(web3.shh, 'deleteKeyPair');
        u.methodExists(web3.shh, 'hasKeyPair');
        u.methodExists(web3.shh, 'getPublicKey');
        u.methodExists(web3.shh, 'getPrivateKey');
        u.methodExists(web3.shh, 'newSymKey');
        u.methodExists(web3.shh, 'addSymKey');
        u.methodExists(web3.shh, 'generateSymKeyFromPassword');
        u.methodExists(web3.shh, 'hasSymKey');
        u.methodExists(web3.shh, 'getSymKey');
        u.methodExists(web3.shh, 'deleteSymKey');
        u.methodExists(web3.shh, 'newMessageFilter');
        u.methodExists(web3.shh, 'post');

    });
});

