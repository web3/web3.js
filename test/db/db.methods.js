var web3   = require('../../index.js');
var u      = require('../test.utils.js');

/* globals describe */

describe('web3', function() {
    describe('db', function() {
        u.methodExists(web3.db, 'put');
        u.methodExists(web3.db, 'get');
        u.methodExists(web3.db, 'putString');
        u.methodExists(web3.db, 'getString');
    });
});

