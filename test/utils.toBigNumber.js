var chai = require('chai');
var utils = require('../packages/web3-utils');

var BigNumber = require('bn.js');

var assert = chai.assert;

var tests = [
    { value: 1, expected: '1' },
    { value: '1', expected: '1' },
    { value: '0x1', expected: '1'},
    { value: '0x01', expected: '1'},
    { value: 15, expected: '15'},
    { value: '15', expected: '15'},
    { value: '0xf', expected: '15'},
    { value: '0x0f', expected: '15'},
    { value: new BigNumber('f', 16), expected: '15'},
    { value: -1, expected: '-1'},
    { value: '-1', expected: '-1'},
    { value: '-0x1', expected: '-1'},
    { value: '-0x01', expected: '-1'},
    { value: -15, expected: '-15'},
    { value: '-15', expected: '-15'},
    { value: '-0xf', expected: '-15'},
    { value: '-0x0f', expected: '-15'},
    { value: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', expected: '115792089237316195423570985008687907853269984665640564039457584007913129639935'},
    { value: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd', expected: '115792089237316195423570985008687907853269984665640564039457584007913129639933'},
    { value: '-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', expected: '-115792089237316195423570985008687907853269984665640564039457584007913129639935'},
    { value: '-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd', expected: '-115792089237316195423570985008687907853269984665640564039457584007913129639933'},
    { value: 0, expected: '0'},
    { value: '0', expected: '0'},
    { value: '0x0', expected: '0'},
    { value: -0, expected: '0'},
    { value: '-0', expected: '0'},
    { value: '-0x0', expected: '0'},
    { value: new BigNumber(0), expected: '0'}
];

describe('lib/utils/utils', function () {
    it('should turn err', function () {
        try{
            utils.toBN('test').toString(10);
        } catch (e) {
            assert.equal(e, 'Error: Error: [number-to-bn] while converting number "test" to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "test"');
        }
    });

    describe('toBN', function () {
        tests.forEach(function (test) {
            it(`should turn ${tests.value} to ${tests.expected}`, function () {
                assert.equal(utils.toBN(test.value).toString(10), test.expected);
            });
        });
    });
});
