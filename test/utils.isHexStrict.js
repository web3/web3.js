var chai = require('chai');
var utils = require('../packages/web3-utils');

var BigNumber = require('bignumber.js');
var BN = require('bn.js');

var assert = chai.assert;

var tests = [
    { value: 0x1, expected: false },  //0x1 would be tested as 1
    { value: '0x1', expected: true },
    { value: '0xH', expected: false},
    { value: 'H', expected: false},
    { value: [1,2,3,{test: 'data'}], expected: false},
    { value: {test: 'test'}, expected: false},
    { value: '{"test": "test"}', expected: false},
    { value: 'myString', expected: false},
    { value: 'myString 34534!', expected: false},
    { value: new BN(15), expected: false},
    { value: new BigNumber(15), expected: false},
    { value: 'Heeäööä👅D34ɝɣ24Єͽ-.,äü+#/', expected: false},
    { value: true, expected: false},
    { value: false, expected: false}
];

describe('lib/utils/utils', function () {
    describe('isHexStrict', function () {
        tests.forEach(function (test) {
            it('should return ' + test.expected + ' for input ' + test.value, function () {
                assert.strictEqual(utils.isHexStrict(test.value), test.expected);
            });
        });
    });
});
