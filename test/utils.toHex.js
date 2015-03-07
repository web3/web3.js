var assert = require('assert');
var utils = require('../lib/utils.js');

describe('utils', function () {
    describe('toHex', function () {
        it('should return the correct value', function () {
            
            assert.equal(utils.toHex(1000),    "0x3e8");
            assert.equal(utils.toHex('1000'),  "0x3e8");
            //assert.equal(utils.toHex('hello'), "0x68656c6c6f");
            //assert.equal(utils.toHex({test: 'test'}), "0x7b2274657374223a2274657374227d");
            //assert.equal(utils.toHex([1,2,3,{hallo:'test'}]),  '0x5b312c322c332c7b2268616c6c6f223a2274657374227d5d');
    
        });
    });
});
