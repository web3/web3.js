import { assert } from 'chai';
import Iban from '../packages/web3-eth-iban';

const tests = [
    {
        institution: 'XREG',
        identifier: 'GAVOFYORK',
        expected: 'XE81ETHXREGGAVOFYORK'
    }
];

describe('lib/web3/iban', () => {
    describe('createIndirect', () => {
        tests.forEach((test) => {
            it(`shoud create indirect iban: ${test.expected}`, () => {
                assert.deepEqual(Iban.createIndirect({
                    institution: test.institution,
                    identifier: test.identifier
                }), new Iban(test.expected));
            });
        });
    });
});
