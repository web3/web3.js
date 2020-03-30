var chai = require('chai');
var utils = require('../packages/web3-utils');

var assert = chai.assert;

var tests = [
    { value: 'Heeäööä👅D34ɝɣ24Єͽ-.,äü+#/', expected: '0x486565c3a4c3b6c3b6c3a4f09f9185443334c99dc9a33234d084cdbd2d2e2cc3a4c3bc2b232f'},
    { value: 'myString', expected: '0x6d79537472696e67'},
    { value: 'myString\x00', expected: '0x6d79537472696e67'},
    { value: 'expected value\u0000\u0000\u0000', expected: '0x65787065637465642076616c7565'},
    { value: 'expect\u0000\u0000ed value\u0000\u0000\u0000', expected: '0x657870656374000065642076616c7565'},
    { value: '我能吞下玻璃而不伤身体。', expected: '0xe68891e883bde5909ee4b88be78ebbe79283e8808ce4b88de4bca4e8baabe4bd93e38082'},
    { value: '나는 유리를 먹을 수 있어요. 그래도 아프지 않아요', expected: '0xeb8298eb8a9420ec9ca0eba6aceba5bc20eba8b9ec9d8420ec889820ec9e88ec96b4ec9a942e20eab7b8eb9e98eb8f8420ec9584ed9484eca78020ec958aec9584ec9a94' },
    { value: 'convert', expected: '0x636f6e76657274'}
];

describe('lib/utils/utils', function () {
    describe('utf8ToHex', function () {
        tests.forEach(function (test) {
            it('should turn ' + test.value + ' to ' + test.expected, function () {
                assert.strictEqual(utils.utf8ToHex(test.value), test.expected);
            });
        });
    });
});
