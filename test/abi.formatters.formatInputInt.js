var chai = require('chai');
var assert = chai.assert;
var formatters = require('../packages/web3-eth-abi/src/formatters.js');
var Param = require('../packages/web3-eth-abi/src/param');

var tests = [
    { input: 1, result: new Param('0000000000000000000000000000000000000000000000000000000000000001') },
    { input: 1.1, result: new Param('0000000000000000000000000000000000000000000000000000000000000001') },
    { input: -1.1, result: new Param('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') },
    { input: -1, result: new Param('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') }
];

describe('formatters', function () {
    describe('formatInputInt', function () {
        tests.forEach(function(test){
            it('should return the correct value', function () {
                assert.deepEqual(formatters.formatInputInt(test.input), test.result);
            });
        });
    });
});
