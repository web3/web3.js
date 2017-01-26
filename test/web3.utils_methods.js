var u = require('./helpers/test.utils.js');
var utils = require('../packages/web3-utils');

describe('utils', function() {
    describe('methods', function () {
        u.methodExists(utils, 'sha3');
        u.methodExists(utils, 'toAscii');
        u.methodExists(utils, 'fromAscii');
        u.methodExists(utils, 'toDecimal');
        u.methodExists(utils, 'fromDecimal');
        u.methodExists(utils, 'fromWei');
        u.methodExists(utils, 'toWei');
        u.methodExists(utils, 'toBigNumber');
        u.methodExists(utils, 'isAddress');
    });
});

