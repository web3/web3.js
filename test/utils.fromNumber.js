import { assert } from 'chai';
import utils from '../packages/web3-utils';

const tests = [
    { value: 1, expected: '0x1' },
    { value: '21345678976543214567869765432145647586', expected: '0x100f073a3d694d13d1615dc9bc3097e2' },
    { value: '1', expected: '0x1' },
    { value: '0x1', expected: '0x1' },
    { value: '0x01', expected: '0x1' },
    { value: 15, expected: '0xf' },
    { value: '15', expected: '0xf' },
    { value: '0xf', expected: '0xf' },
    { value: '0x0f', expected: '0xf' },
    { value: -1, expected: '-0x1' },
    { value: '-1', expected: '-0x1' },
    { value: '-0x1', expected: '-0x1' },
    { value: '-0x01', expected: '-0x1' },
    { value: -15, expected: '-0xf' },
    { value: '-15', expected: '-0xf' },
    { value: '-0xf', expected: '-0xf' },
    { value: '-0x0f', expected: '-0xf' },
    { value: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', expected: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' },
    { value: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd', expected: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd' },
    { value: '-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', expected: '-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' },
    { value: '-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd', expected: '-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd' },
    { value: 0, expected: '0x0' },
    { value: '0', expected: '0x0' },
    { value: '0x0', expected: '0x0' },
    { value: -0, expected: '0x0' },
    { value: '-0', expected: '0x0' },
    { value: '-0x0', expected: '0x0' }
];

describe('lib/utils/utils', () => {
    describe('numberToHex', () => {
        tests.forEach((test) => {
            it(`should turn ${test.value} to ${test.expected}`, () => {
                assert.equal(utils.numberToHex(test.value), test.expected);
            });
        });
    });
});
