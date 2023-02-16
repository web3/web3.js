var chai = require('chai');
var utils = require('../packages/web3-utils');

var BigNumber = require('bignumber.js');
var BN = require('bn.js');

var assert = chai.assert;

var tests = [
    { value: 1, expected: 1 },
    { value: '1', expected: 1 },
    { value: '0x1', expected: 1},
    { value: '15', expected: 15},
    { value: '0xf', expected: 15},
    { value: -1, expected: -1},
    { value: '-1', expected: -1},
    { value: '-0x1', expected: -1},
    { value: '-15', expected: -15},
    { value: '-0xf', expected: -15},
    { value: '0x657468657265756d', expected: '7310582880049395053'},
    { value: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd', expected: '115792089237316195423570985008687907853269984665640564039457584007913129639933'},
    { value: '-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', expected: '-115792089237316195423570985008687907853269984665640564039457584007913129639935'},
    { value: '-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd', expected: '-115792089237316195423570985008687907853269984665640564039457584007913129639933'},
    { value: 0, expected: 0},
    { value: '0', expected: 0},
    { value: '0x0', expected: 0},
    { value: -0, expected: -0},
    { value: '-0', expected: -0},
    { value: '-0x0', expected: -0},
    { value: [1,2,3,{test: 'data'}], expected: '0x5b312c322c332c7b2274657374223a2264617461227d5d', error: true, errorMessage: 'Given value "1,2,3,[object Object]" is not a valid string, number or BN.'},
    { value: {test: 'test'}, expected: '0x7b2274657374223a2274657374227d', error: true, errorMessage: 'Given value "[object Object]" is not a valid string, number or BN.'},
    { value: '{"test": "test"}', expected: '0x7b2274657374223a202274657374227d', error: true, errorMessage: 'Given value "{"test": "test"}" is not a valid hex string.'},
    { value: 'myString', expected: '0x6d79537472696e67', error: true, errorMessage: 'Given value "myString" is not a valid hex string.'},
    { value: 'myString 34534!', expected: '0x6d79537472696e6720333435333421', error: true, errorMessage: ' Given value "myString 34534!" is not a valid hex string.'},
    { value: new BN(15), expected: 15},
    { value: new BigNumber(15), expected: 15},
    { value: 'Heeäööä👅D34ɝɣ24Єͽ-.,äü+#/', expected: '0x486565c3a4c3b6c3b6c3a4f09f9185443334c99dc9a33234d084cdbd2d2e2cc3a4c3bc2b232f', error: true, errorMessage: 'Given value "Heeäööä👅D34ɝɣ24Єͽ-.,äü+#/" is not a valid hex string.'},
    { value: true, expected: 1},
    { value: false, expected: 0},
];

describe('lib/utils/utils', function () {
    describe('toNumber', function () {
        tests.forEach(function (test) {
            if (test.error) {
                it('should error with message', function () {
                    try {
                        utils.toNumber(test.value)
                        assert.fail();
                    } catch(err){
                        assert.strictEqual(err.message, test.errorMessage);
                    }
                });
            } else {
                it('should turn ' + test.value + ' to ' + test.expected, function () {
                    assert.strictEqual(utils.toNumber(test.value), test.expected);
                });
            }
        });
    });
});
