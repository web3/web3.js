var chai = require('chai');
var utils = require('../packages/web3-utils');
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
    { value: '내가 제일 잘 나가', expected:'0xeb82b4eab08020eca09cec9dbc20ec9e9820eb8298eab080'},
    { value: new BigNumber(15), expected: '0xf'},
    { value: true, expected: '0x01'},
    { value: false, expected: '0x00'},
    { value: '\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB',
      expected: '0x0300000035c3a8c386c3954c5d127cc29dc38ec2bec29e1a37c2abc29b05321128c390c297590a3c100000000000006521c39f642fc3b1c3b5c3ac0c3a7ac2a6c38ec2a6c2b1c3a7c2b7c3b7c38dc2a2c38bc39f07362ac28508c28ec297c3b1c29ec3b94331c38955c380c3a9321ac393c28642c28c'}
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
