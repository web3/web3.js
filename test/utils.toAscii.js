var chai = require('chai');
var BigNumber = require('bignumber.js');
var web3 = require('../index');
var assert = chai.assert;

var tests = [
    { value: '0x6d79537472696e67', expected: 'myString'},
    { value: '0x6d79537472696e6700', expected: 'myString\u0000'},
    { value: "0x0300000035e8c6d54c5d127c9dcebe9e1a37ab9b05321128d097590a3c100000000000006521df642ff1f5ec0c3a7aa6cea6b1e7b7f7cda2cbdf07362a85088e97f19ef94331c955c0e9321ad386428c",
      expected: '\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB'}
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
