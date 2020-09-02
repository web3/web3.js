const chai = require('chai');
const assert = chai.assert;
const BN = require('bn.js');
const formatters = require('../packages/web3-utils/src/index.js');

const pending = "pending";
const latest = "latest";
const genesis = "genesis";
const earliest = "earliest";

const tests = [
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
    // Base cases for strings (sanity)
    { input: {a: genesis, b: earliest}, result: 0 },
    { input: {a: genesis, b: 0}, result: 0 },
    { input: {a: earliest, b: 0}, result: 0 },
    { input: {a: latest, b: latest}, result: 0 },
    { input: {a: pending, b: pending}, result: 0 },
    // Complex Strings
    // Genesis
    { input: {a: earliest, b: 2}, result: -1 },    
    { input: {a: earliest, b: new BN(2)}, result: -1 },
    { input: {a: earliest, b: latest}, result: -1 },
    { input: {a: earliest, b: pending}, result: -1 },
    { input: {a: genesis, b: 2}, result: -1 },    
    { input: {a: genesis, b: new BN(2)}, result: -1 },
    { input: {a: genesis, b: latest}, result: -1 },
    { input: {a: genesis, b: pending}, result: -1 },
    // latest
    { input: {a: latest, b: 0}, result: 1 },
    { input: {a: latest, b: new BN(1)}, result: 1 },
    { input: {a: latest, b: pending}, result: -1 },
    // pending 
    { input: {a: pending, b: 0}, result: 1 },
    { input: {a: pending, b: new BN(1)}, result: 1 },
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
