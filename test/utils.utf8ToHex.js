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
    { value: true, expected: '0x'},
    { value: false, expected: '0x'},
    { value: '\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB',
        expected: '0x0300000035c3a8c386c3954c5d127cc29dc38ec2bec29e1a37c2abc29b05321128c390c297590a3c100000000000006521c39f642fc3b1c3b5c3ac0c3a7ac2a6c38ec2a6c2b1c3a7c2b7c3b7c38dc2a2c38bc39f07362ac28508c28ec297c3b1c29ec3b94331c38955c380c3a9321ac393c28642c28c'},
    { value: 'myString 34534!', expected: '0x6d79537472696e6720333435333421'},
    { value: '내가 제일 잘 나가', expected:'0xeb82b4eab08020eca09cec9dbc20ec9e9820eb8298eab080'},
    { value: {test: 'test'}, expected: '0x'},
    { value: '{"test": "test"}', expected: '0x7b2274657374223a202274657374227d'},
    { value: 0, expected: '0x'},
    { value: '0', expected: '0x30'},
    { value: '0x657468657265756d', expected: '0x307836353734363836353732363537353664'},
    { value: 1, expected: '0x' },
    { value: '1', expected: '0x31' }
];

describe('lib/utils/utils', function () {
    describe('utf8ToHex', function () {
        tests.forEach(function (test) {
            it(`should turn ${tests.value} to ${tests.expected}`, function () {
                assert.strictEqual(utils.utf8ToHex(test.value), test.expected);
            });
        });
    });
});
