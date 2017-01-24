var chai = require('chai');
var utils = require('../packages/web3-utils');

var assert = chai.assert;

var tests = [
    { value: 'myString', expected: '0x6d79537472696e67'},
    { value: 'myString\x00', expected: '0x6d79537472696e67'},
    { value: 'expected value\u0000\u0000\u0000', expected: '0x65787065637465642076616c7565'}
];

describe('lib/utils/utils', function () {
    describe('fromUtf8', function () {
        tests.forEach(function (test) {
            it('should turn ' + test.value + ' to ' + test.expected, function () {
                assert.strictEqual(utils.fromUtf8(test.value), test.expected);
            });
        });
    });
});
