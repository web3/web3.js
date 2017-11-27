import { assert } from 'chai';
import utils from '../packages/web3-utils';

const tests = [
    { value() {}, is: false },
    { value: new Function(), is: false }, // eslint-disable-line no-new-func
    { value: 'function', is: false },
    { value: {}, is: false },
    { value: '0xc6d9d2cd449a754c494264e1809c50e34d64562b', is: true },
    { value: 'c6d9d2cd449a754c494264e1809c50e34d64562b', is: true }
];

describe('lib/utils/utils', () => {
    describe('isAddress', () => {
        tests.forEach((test) => {
            it(`shoud test if value ${test.value} is address: ${test.is}`, () => {
                assert.equal(utils.isAddress(test.value), test.is);
            });
        });
    });
});
