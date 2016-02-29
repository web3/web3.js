var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../index.js');
var web3 = new Web3();
var u = require('./helpers/test.utils.js');

describe('web3.net', function() {
    describe('methods', function() {
        u.propertyExists(web3.personal, 'listAccounts');
        u.methodExists(web3.personal, 'newAccount');
        u.methodExists(web3.personal, 'unlockAccount');
    });
});
