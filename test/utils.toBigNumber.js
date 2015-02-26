var assert = require('assert');
var utils = require('../lib/utils.js');
var BigNumber = require('bignumber.js');

describe('utils', function () {
    describe('toBigNumber', function () {
        it('should return the correct value', function () {
            
            assert.equal(utils.toBigNumber(100000) instanceof BigNumber, true);
            assert.equal(utils.toBigNumber(100000).toString(10),  '100000');
        });
    });
});