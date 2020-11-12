var chai = require('chai');
var utils = require('../packages/web3-utils');

var BigNumber = require('bignumber.js');
var BN = require('bn.js');

var assert = chai.assert;

var tests = [
    { value: '1', expected: '1' },
    { value: '0x1', expected: '1'},
    { value: '0xf', expected: 'f'},
    { value: '-1', expected: '-1'},
    { value: '-0x1', expected: '-1'},
    { value: '-15', expected: '-15'},
    { value: '-0xf', expected: '-f'},
    { value: '0x657468657265756d', expected: '657468657265756d'},
    { value: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd', expected: 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd'},
    { value: '-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', expected: '-ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'},
    { value: '-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd', expected: '-fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd'},
    { value: 0, expected: 0},
    { value: '0', expected: '0'},
    { value: '0x0', expected: '0'},
    { value: -0, expected: -0},
    { value: '-0', expected: '-0'},
    { value: '-0x0', expected: '-0'},
    { value: [1,2,3,{test: 'data'}], expected: [1,2,3,{test: 'data'}]},
    { value: {test: 'test'}, expected: {test: 'test'}},
    { value: '{"test": "test"}', expected: '{"test": "test"}'},
    { value: 'myString', expected: 'myString'},
    { value: 'myString 34534!', expected: 'myString 34534!'},
    { value: new BN(15), expected: new BN(15)},
    { value: new BigNumber(15), expected: new BigNumber(15)},
    { value: 'Heeäööä👅D34ɝɣ24Єͽ-.,äü+#/', expected: 'Heeäööä👅D34ɝɣ24Єͽ-.,äü+#/'},
    { value: true, expected: true},
    { value: false, expected: false},
    { value: 'ff\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB',
      expected: 'ff\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB'},
    { value: '\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB',
      expected: '\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB'},
    { value: '내가 제일 잘 나가', expected: '내가 제일 잘 나가'},
    { value: Buffer.from('100'), expected: Buffer.from('100')},
    { value: '0xfffff0x0fffffffffff0xffffff0x', expected: '0xfffff0x0fffffffffff0xffffff0x'}
];

describe('lib/utils/utils', function () {
    describe('stripHexPrefix', function () {
        tests.forEach(function (test) {
            it('should turn ' + test.value + ' to ' + test.expected, function () {
                assert.deepEqual(utils.stripHexPrefix(test.value), test.expected);
            });
        });
    });
});
