var chai = require('chai');
var BigNumber = require('bignumber.js');
var utils = require('../lib/utils/utils.js');
var assert = chai.assert;

var tests = [
    { value: 'myString', expected: '0x6d79537472696e67'},
    { value: 'myString\x00', expected: '0x6d79537472696e6700'},
    { value: '\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB',
      expected: '0x0300000035e8c6d54c5d127c9dcebe9e1a37ab9b05321128d097590a3c100000000000006521df642ff1f5ec0c3a7aa6cea6b1e7b7f7cda2cbdf07362a85088e97f19ef94331c955c0e9321ad386428c'}
];

var paddedTests = [
  { value: 'myString', padding: 32, expected: '0x6d79537472696e670000000000000000'},
  { value: 'myString\x00', padding: 32, expected: '0x6d79537472696e670000000000000000'},
  { value: '\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB',
    padding: 165,
    expected: '0x0300000035e8c6d54c5d127c9dcebe9e1a37ab9b05321128d097590a3c100000000000006521df642ff1f5ec0c3a7aa6cea6b1e7b7f7cda2cbdf07362a85088e97f19ef94331c955c0e9321ad386428c00000'}
]

describe('lib/utils/utils', function () {
    describe('fromAscii', function () {
        tests.forEach(function (test) {
            it('should turn ' + test.value + ' to ' + test.expected, function () {
                assert.strictEqual(utils.fromAscii(test.value), test.expected);
            });
        });

        paddedTests.forEach(function (paddedTest) {
            it('should turn ' + paddedTest.value + ' to ' + paddedTest.expected, function () {
                assert.strictEqual(utils.fromAscii(paddedTest.value, paddedTest.padding), paddedTest.expected);
            });
        });
    });
});
