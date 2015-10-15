var chai = require('chai');
var assert = chai.assert; 
var Web3 = require('../index.js');
var web3 = new Web3();
var u = require('./helpers/test.utils.js');

describe('web3.shh', function() {
    describe('methods', function() {
        u.methodExists(web3.shh, 'post');
        u.methodExists(web3.shh, 'newIdentity');
        u.methodExists(web3.shh, 'hasIdentity');
        u.methodExists(web3.shh, 'newGroup');
        u.methodExists(web3.shh, 'addToGroup');
        u.methodExists(web3.shh, 'filter');
    });
});

