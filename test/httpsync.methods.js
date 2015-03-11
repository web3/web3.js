var assert = require('assert');
var httpProvider = require('../lib/web3/httpprovider');
var u = require('./test.utils.js');

describe('httpsync', function () {
    var h = new httpProvider(null);
    u.methodExists(h, 'send');
});
