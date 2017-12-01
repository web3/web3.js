import { assert } from 'chai';
import Iban from '../packages/web3-eth-iban';

const tests = [
    {
        direct: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS',
        address: '0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8'
    }
];

describe('lib/web3/iban', () => {
    describe('Iban.toAddress()', () => {
        tests.forEach((test) => {
            it(`shoud transform iban to address: ${test.address}`, () => {
                assert.deepEqual(Iban.toAddress(test.direct), test.address);
            });
        });
    });
    describe('iban instance address()', () => {
        tests.forEach((test) => {
            it(`shoud transform iban to address: ${test.address}`, () => {
                const iban = new Iban(test.direct);
                assert.deepEqual(iban.toAddress(), test.address);
            });
        });
    });
});
