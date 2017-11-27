import { assert } from 'chai';
import formatters from '../packages/web3-core-helpers/src/formatters.js';

const tests = [
    {
        value: 'genesis',
        expected: '0x0'
    },
    {
        value: 'latest',
        expected: 'latest'
    },
    {
        value: 'pending',
        expected: 'pending'
    },
    {
        value: 'earliest',
        expected: '0x0'
    },
    {
        value: 1,
        expected: '0x1'
    },
    {
        value: '0x1',
        expected: '0x1'
    }
];

describe('lib/web3/formatters', () => {
    describe('inputDefaultBlockNumberFormatter', () => {
        tests.forEach((test) => {
            it(`should turn ${test.value} to ${test.expected}`, () => {
                const actual = formatters.inputDefaultBlockNumberFormatter(test.value);
                assert.strictEqual(actual, test.expected);
            });
        });
    });
});
