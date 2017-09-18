var u = require('./helpers/test.utils.js');
var Web3 = require('../packages/web3');
var web3 = new Web3();

describe('web3', function() {
    describe('methods', function () {
        u.methodExists(web3, 'setProvider');

        u.propertyExists(web3, 'givenProvider');

        u.propertyExists(web3, 'eth');
        u.propertyExists(web3, 'bzz');
        u.propertyExists(web3, 'shh');

        u.propertyExists(web3, 'utils');
    });
});

