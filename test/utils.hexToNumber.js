var assert = require('assert');
var utils = require('../packages/web3-utils');

describe('lib/utils/utils', function () {
    describe('hexToNumber', function () {
        it('should return the correct value', function () {

            assert.equal(utils.hexToNumber("0x3e8"), 1000);
            assert.equal(utils.hexToNumber('0x1f0fe294a36'), 2134567897654);
            // allow compatiblity
            assert.equal(utils.hexToNumber(100000), 100000);
        });

        it('should validate hex strings', function() {
            try {
              utils.hexToNumber('100000');
              assert.fail();
            } catch (error){
              assert(error.message.includes('is not a valid hex string'))
            }
        })
    });
});
