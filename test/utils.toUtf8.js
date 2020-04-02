var chai = require('chai');
var utils = require('../packages/web3-utils');

var assert = chai.assert;

var tests = [
    { value: '0x486565c3a4c3b6c3b6c3a4f09f9185443334c99dc9a33234d084cdbd2d2e2cc3a4c3bc2b232f', expected: 'Heeäööä👅D34ɝɣ24Єͽ-.,äü+#/'},
    { value: '0x6d79537472696e67', expected: 'myString'},
    { value: '0x6d79537472696e6700', expected: 'myString'},
    { value: '0x65787065637465642076616c7565000000000000000000000000000000000000', expected: 'expected value'},
    { value: '0x000000000000000000000000000000000000657870656374000065642076616c7565', expected: 'expect\u0000\u0000ed value'},
    { value: '0x74657374696e67', expected: 'testing'},
];

describe('lib/utils/utils', function () {
    it('should turn err', function () {
        var val = [1, 2, 3];
        try {
            utils.toUtf8(val);
            assert.fail();
        } catch (error) {
            assert(error.message.includes('The parameter "'+ val +'" must be a valid HEX string.'));
        }
    });

    describe('hexToUtf8', function () {
        tests.forEach(function (test) {
            it(`should turn ${tests.value} to ${tests.expected}`, function () {
                assert.strictEqual(utils.toUtf8(test.value), test.expected);
            });
        });
    });
});
