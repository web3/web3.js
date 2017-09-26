/**
 * Created by danielbruce on 2017-09-25.
 */
var chai = require('chai');
var assert = chai.assert;
var utils = require('../packages/web3-utils/');
var BigNumber = require('bignumber.js');

var tests = [
    { value: 1, expected: utils.padLeft(new BigNumber(1).round().toString(16), 64) },
    { value: '1', expected: utils.padLeft(new BigNumber(1).toString(16), 64) },
    { value: '0x1', expected: utils.padLeft(new BigNumber(1).toString(16), 64) },
    { value: '15', expected: utils.padLeft(new BigNumber(15).toString(16), 64)},
    { value: '0xf', expected: utils.padLeft(new BigNumber(15).toString(16), 64)},
    { value: -1, expected: new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16).plus(new BigNumber(-1)).plus(1).toString(16)},
    { value: '-1', expected: new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16).plus(new BigNumber(-1)).plus(1).toString(16)},
    { value: '-0x1', expected: new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16).plus(new BigNumber(-1)).plus(1).toString(16)},
    { value: '-15', expected: new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16).plus(new BigNumber(-15)).plus(1).toString(16)},
    { value: '-0xf', expected: new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16).plus(new BigNumber(-15)).plus(1).toString(16)},
    { value: 0, expected: utils.padLeft(new BigNumber(0).toString(16), 64)},
    { value: '0', expected: utils.padLeft(new BigNumber(0).toString(16), 64)},
    { value: '0x0', expected: utils.padLeft(new BigNumber(0).toString(16), 64)},
    { value: -0, expected: utils.padLeft(new BigNumber(0).toString(16), 64)},
    { value: '-0', expected: utils.padLeft(new BigNumber(0).toString(16), 64)},
    { value: '-0x0', expected: utils.padLeft(new BigNumber(0).toString(16), 64)},
    { value: new BigNumber(15), expected: utils.padLeft(new BigNumber(15).toString(16), 64)}
];

describe('lib/utils/utils', function () {
    describe('toTwosComplement', function () {
        tests.forEach(function (test) {
            it('printing ' + test.value, function () {
                assert.equal(utils.toTwosComplement(test.value).replace('0x',''), test.expected);
            });
        });
    });
});
