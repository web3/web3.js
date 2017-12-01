import { assert } from 'chai';
import formatters from '../packages/web3-eth-abi/src/formatters.js';
import Param from '../packages/web3-eth-abi/src/param';

const tests = [
    {
        input: 1,
        result: new Param('0000000000000000000000000000000000000000000000000000000000000001')
    },
    {
        input: 1.1,
        result: new Param('0000000000000000000000000000000000000000000000000000000000000001')
    },
    {
        input: -1.1,
        result: new Param('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    },
    {
        input: -1,
        result: new Param('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    }
];

describe('formatters', () => {
    describe('formatInputInt', () => {
        tests.forEach((test) => {
            it('should return the correct value', () => {
                assert.deepEqual(formatters.formatInputInt(test.input), test.result);
            });
        });
    });
});
