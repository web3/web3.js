var chai = require('chai');
var assert = chai.assert;
var formatters = require('../packages/web3-eth-contract/src/solidity/formatters.js');
var SolidityParam = require('../packages/web3-eth-contract/src/solidity/param');

var tests = [
    { input: 1, result: new SolidityParam('0000000000000000000000000000000000000000000000000000000000000001') },
    { input: 1.1, result: new SolidityParam('0000000000000000000000000000000000000000000000000000000000000001') },
    { input: -1.1, result: new SolidityParam('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') },
    { input: -1, result: new SolidityParam('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') }
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
