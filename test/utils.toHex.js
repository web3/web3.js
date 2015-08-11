var chai = require('chai');
var utils = require('../lib/utils/utils');
var BigNumber = require('bignumber.js');
var assert = chai.assert;

var tests = [
    { value: 1, expected: '0x1' },
    { value: '1', expected: '0x1' },
    { value: '0x1', expected: '0x1'},
    { value: '15', expected: '0xf'},
    { value: '0xf', expected: '0xf'},
    { value: -1, expected: '-0x1'},
    { value: '-1', expected: '-0x1'},
    { value: '-0x1', expected: '-0x1'},
    { value: '-15', expected: '-0xf'},
    { value: '-0xf', expected: '-0xf'},
    { value: '0x657468657265756d', expected: '0x657468657265756d'},
    { value: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd', expected: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd'},
    { value: '-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', expected: '-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'},
    { value: '-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd', expected: '-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd'},
    { value: 0, expected: '0x0'},
    { value: '0', expected: '0x0'},
    { value: '0x0', expected: '0x0'},
    { value: -0, expected: '0x0'},
    { value: '-0', expected: '0x0'},
    { value: '-0x0', expected: '0x0'},
    { value: [1,2,3,{test: 'data'}], expected: '0x5b312c322c332c7b2274657374223a2264617461227d5d'},
    { value: {test: 'test'}, expected: '0x7b2274657374223a2274657374227d'},
    { value: '{"test": "test"}', expected: '0x7b2274657374223a202274657374227d'},
    { value: 'myString', expected: '0x6d79537472696e67'},
    { value: new BigNumber(15), expected: '0xf'},
    { value: true, expected: '0x1'},
    { value: false, expected: '0x0'},
    { value: '\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB',
      expected: '0x0300000035e8c6d54c5d127c9dcebe9e1a37ab9b05321128d097590a3c100000000000006521df642ff1f5ec0c3a7aa6cea6b1e7b7f7cda2cbdf07362a85088e97f19ef94331c955c0e9321ad386428c'}
];

describe('lib/utils/utils', function () {
    describe('toHex', function () {
        tests.forEach(function (test) {
            it('should turn ' + test.value + ' to ' + test.expected, function () {
                assert.strictEqual(utils.toHex(test.value), test.expected);
            });
        });
    });
});
