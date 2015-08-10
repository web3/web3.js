var chai = require('chai');
var BigNumber = require('bignumber.js');
var web3 = require('../index');
var assert = chai.assert;

var tests = [
    { value: '0x6d79537472696e67', expected: 'myString'},
    { value: '0x6d79537472696e6700', expected: 'myString'},
];

describe('lib/utils/utils', function () {
    describe('toAscii', function () {
        tests.forEach(function (test) {
            it('should turn ' + test.value + ' to ' + test.expected, function () {
                assert.strictEqual(web3.toAscii(test.value), test.expected);
            });
        });
    });
});

