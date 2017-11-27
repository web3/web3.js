import { assert } from 'chai';
import BigNumber from 'bn.js';
import utils from '../packages/web3-utils';

const tests = [
    { value() {}, is: false },
    { value: new Function(), is: false }, // eslint-disable-line no-new-func
    { value: 'function', is: false },
    { value: {}, is: false },
    { value: new String('hello'), is: false }, // eslint-disable-line no-new-wrappers
    { value: new BigNumber(0), is: true },
    { value: 132, is: false },
    { value: '0x12', is: false }

];

describe('lib/utils/utils', () => {
    describe('isBigNumber', () => {
        tests.forEach((test) => {
            it(`shoud test if value ${test.func} is BigNumber: ${test.is}`, () => {
                assert.equal(utils.isBN(test.value), test.is);
            });
        });
    });
});
