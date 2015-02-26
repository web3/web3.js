var assert = require('assert');
var utils = require('../lib/utils.js');

describe('utils', function () {
    describe('fromDecimal', function () {
        it('should return the correct value', function () {
            
            assert.equal(utils.fromDecimal(1000), "0x3e8");
            assert.equal(utils.fromDecimal('1000'), "0x3e8");
        });
    });
});