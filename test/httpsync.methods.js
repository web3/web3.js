var assert = require('assert');
var httpProvider = require('../lib/httpsync');
var u = require('./test.utils.js');

describe('httpsync', function () {
    var h = new httpProvider(null);
    u.methodExists(h, 'send');
});
