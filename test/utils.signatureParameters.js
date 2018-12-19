var chai = require('chai');
var utils = require('../packages/web3-utils');

var assert = chai.assert;

describe('lib/utils/utils', function () {
    describe('getSignatureParameters', function () {
        it('should return the correct rsv values', function () {
             let params = utils.getSignatureParameters('0x5763ab346198e3e6cc4d53996ccdeca0c941cb6cb70d671d97711c421d3bf7922c77ef244ad40e5262d1721bf9638fb06bab8ed3c43bfaa80d6da0be9bbd33dc1b');
            console.log(params);
             assert.equal(params.r, '0x5763ab346198e3e6cc4d53996ccdeca0c941cb6cb70d671d97711c421d3bf792');
             assert.equal(params.s, '0x2c77ef244ad40e5262d1721bf9638fb06bab8ed3c43bfaa80d6da0be9bbd33dc');
             assert.equal(params.v, '27');
        });
    });
});
