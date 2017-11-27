/**
 * Created by danielbruce on 2017-09-25.
 */
import { assert } from 'chai';
import BigNumber from 'bignumber.js';
import utils from '../packages/web3-utils';

const tests = [
    { value: 1, expected: utils.padLeft(new BigNumber(1).round().toString(16), 64) },
    { value: '1', expected: utils.padLeft(new BigNumber(1).toString(16), 64) },
    { value: '0x1', expected: utils.padLeft(new BigNumber(1).toString(16), 64) },
    { value: '15', expected: utils.padLeft(new BigNumber(15).toString(16), 64) },
    { value: '0xf', expected: utils.padLeft(new BigNumber(15).toString(16), 64) },
    { value: -1, expected: new BigNumber('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 16).plus(new BigNumber(-1)).plus(1).toString(16) },
    { value: '-1', expected: new BigNumber('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 16).plus(new BigNumber(-1)).plus(1).toString(16) },
    { value: '-0x1', expected: new BigNumber('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 16).plus(new BigNumber(-1)).plus(1).toString(16) },
    { value: '-15', expected: new BigNumber('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 16).plus(new BigNumber(-15)).plus(1).toString(16) },
    { value: '-0xf', expected: new BigNumber('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 16).plus(new BigNumber(-15)).plus(1).toString(16) },
    { value: 0, expected: utils.padLeft(new BigNumber(0).toString(16), 64) },
    { value: '0', expected: utils.padLeft(new BigNumber(0).toString(16), 64) },
    { value: '0x0', expected: utils.padLeft(new BigNumber(0).toString(16), 64) },
    { value: -0, expected: utils.padLeft(new BigNumber(0).toString(16), 64) },
    { value: '-0', expected: utils.padLeft(new BigNumber(0).toString(16), 64) },
    { value: '-0x0', expected: utils.padLeft(new BigNumber(0).toString(16), 64) },
    { value: new BigNumber(15), expected: utils.padLeft(new BigNumber(15).toString(16), 64) }
];

describe('lib/utils/utils', () => {
    describe('toTwosComplement', () => {
        tests.forEach((test) => {
            it(`printing ${test.value}`, () => {
                assert.equal(utils.toTwosComplement(test.value).replace('0x', ''), test.expected);
            });
        });
    });
});
