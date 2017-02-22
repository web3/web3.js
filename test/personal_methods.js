var chai = require('chai');
var assert = chai.assert;
var u = require('./helpers/test.utils.js');
var Personal = require('../packages/web3-personal');
var personal = new Personal();

describe('web3.net', function() {
    describe('methods', function() {
        u.methodExists(personal, 'getAccounts');
        u.methodExists(personal, 'newAccount');
        u.methodExists(personal, 'unlockAccount');
        u.methodExists(personal, 'lockAccount');
        u.methodExists(personal, 'sendTransaction');
    });
});
