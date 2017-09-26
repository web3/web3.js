/**
 * Created by danielbruce on 2017-09-25.
 */

/**
 * Created by danielbruce on 2017-09-25.
 */
var chai = require('chai');
var utils = require('../lib/utils/utils');
var BigNumber = require('bignumber.js');
var assert = chai.assert;

var tests = [
    { value: 1, expected: new BigNumber(1).round() },
    { value: '1', expected: new BigNumber(1) },
    { value: '0x1', expected: new BigNumber(1) },
    { value: '15', expected: new BigNumber(15)},
    { value: '0xf', expected: new BigNumber(15)},
    { value: -1, expected: new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16).plus(new BigNumber(-1)).plus(1)},
    { value: '-1', expected: new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16).plus(new BigNumber(-1)).plus(1)},
    { value: '-0x1', expected: new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16).plus(new BigNumber(-1)).plus(1)},
    { value: '-15', expected: new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16).plus(new BigNumber(-15)).plus(1)},
    { value: '-0xf', expected: new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16).plus(new BigNumber(-15)).plus(1)},
    { value: 0, expected: new BigNumber(0)},
    { value: '0', expected: new BigNumber(0)},
    { value: '0x0', expected: new BigNumber(0)},
    { value: -0, expected: new BigNumber(0)},
    { value: '-0', expected: new BigNumber(0)},
    { value: '-0x0', expected: new BigNumber(0)},
    { value: new BigNumber(15), expected: new BigNumber(15)}
];

describe('lib/utils/utils', function () {
    describe('toTwosComplement', function () {
        tests.forEach(function (test) {
            it('printing ' + test.value, function () {
                assert(test.expected.equals(utils.toTwosComplement(test.value)));
            });
        });
    });
});
