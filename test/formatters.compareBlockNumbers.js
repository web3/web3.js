var chai = require('chai');
var assert = chai.assert;
var BN = require('bn.js');
var formatters = require('../packages/web3-core-helpers/src/formatters.js');

var tests = [
    // Base cases for numbers
    { input: {a: 1, b: 1}, result: 0 },
    { input: {a: 1, b: 2}, result: -1 },
    { input: {a: 2, b: 1}, result: 1 },
    // Base cases for BN
    { input: {a: new BN(1), b: new BN(1)}, result: 0 },
    { input: {a: new BN(1), b: new BN(2)}, result: -1 },
    { input: {a: new BN(2), b: new BN(1)}, result: 1 },
    // Base cases for numbers vs BN
    { input: {a: new BN(1), b: 1}, result: 0 },
    { input: {a: new BN(1), b: 2}, result: -1 },
    { input: {a: new BN(2), b: 1}, result: 1 },
    
];

describe('formatters', function () {
    describe('compare blocknumbers', function () {
        tests.forEach(function(test){
            it('should return the correct value', function () {
                assert.deepEqual(formatters.compareBlockNumbers(test.input.a, test.input.b), test.result);
            });
        });
    });
});
