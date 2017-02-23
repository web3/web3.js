var assert = require('assert');
var utils = require('../packages/web3-utils');

describe('lib/utils/utils', function () {
    describe('toDecimal', function () {
        it('should return the correct value', function () {

            assert.equal(utils.toDecimal("0x3e8"), 1000);
            assert.equal(utils.toDecimal('0x1f0fe294a36'), 2134567897654);
            // allow compatiblity
            assert.equal(utils.toDecimal(100000), 100000);
            assert.equal(utils.toDecimal('100000'), 100000);
        });
    });
});
