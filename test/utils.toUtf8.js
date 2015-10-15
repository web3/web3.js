var chai = require('chai');
var BigNumber = require('bignumber.js');
var utils = require('../lib/utils/utils.js');
var assert = chai.assert;

var tests = [
    { value: '0x6d79537472696e67', expected: 'myString'},
    { value: '0x6d79537472696e6700', expected: 'myString'},
    { value: '0x65787065637465642076616c7565000000000000000000000000000000000000', expected: 'expected value'}
];

describe('lib/utils/utils', function () {
    describe('toUtf8', function () {
        tests.forEach(function (test) {
            it('should turn ' + test.value + ' to ' + test.expected, function () {
                assert.strictEqual(utils.toUtf8(test.value), test.expected);
            });
        });
    });
});
