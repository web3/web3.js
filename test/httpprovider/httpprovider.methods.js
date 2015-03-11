var chai         = require('chai');
var assert       = chai.assert;
var httpProvider = require('../../lib/web3/httpprovider');
var u            = require('../test.utils.js');

describe('httpsync', function () {
    var h = new httpProvider(null);
    u.methodExists(h, 'send');
});
