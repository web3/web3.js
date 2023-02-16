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
    { value: [1,2,3,{test: 'data'}], expected: '8734466057720693480455376997372198952121265679558147421'},
    { value: {test: 'test'}, expected: '639351337390720496868710369885168253'},
    { value: '{"test": "test"}', expected: '163673942372024447198222674986970391165'},
    { value: 'myString', expected: '7888427981916958311'},
    { value: 'myString 34534!', expected: '568421141118403315336782784712881185'},
    { value: new BN(15), expected: 15},
    { value: new BigNumber(15), expected: 15},
    { value: 'Heeäööä👅D34ɝɣ24Єͽ-.,äü+#/', expected: '9217089234592088086444699797948423596835884090143084093263839537376624562728728246738428719'},
    { value: 'Good', expected: 1198485348},
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
