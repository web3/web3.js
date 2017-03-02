var chai = require('chai');
var utils = require('../packages/web3-utils');

var assert = chai.assert;

var tests = [
    { value: '0x486565c3a4c3b6c3b6c3a4f09f9185443334c99dc9a33234d084cdbd2d2e2cc3a4c3bc2b232f', expected: 'Heeäööä👅D34ɝɣ24Єͽ-.,äü+#/'},
    { value: '0x6d79537472696e67', expected: 'myString'},
    { value: '0x6d79537472696e6700', expected: 'myString\u0000'},
    { value: '0x65787065637465642076616c7565000000000000000000000000000000000000', expected: 'expected value\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000'},
    { value: '0x00000000000000000000000000000000000065787065637465642076616c7565', expected: '\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000expected value'}
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
