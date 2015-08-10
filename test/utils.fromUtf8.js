var chai = require('chai');
var BigNumber = require('bignumber.js');
var web3 = require('../index');
var assert = chai.assert;

var tests = [
    { value: 'myString', expected: '0x6d79537472696e67'},
    { value: 'myString\x00', expected: '0x6d79537472696e6700'},
];

describe('lib/utils/utils', function () {
    describe('fromUtf8', function () {
        tests.forEach(function (test) {
            it('should turn ' + test.value + ' to ' + test.expected, function () {
                assert.strictEqual(web3.fromUtf8(test.value), test.expected);
            });
        });
    });
});

