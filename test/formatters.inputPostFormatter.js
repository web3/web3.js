import { assert } from 'chai';
import formatters from '../packages/web3-core-helpers/src/formatters.js';

describe('formatters', () => {
    describe('inputPostFormatter', () => {
        it('should return the correct value', () => {
            // input as strings and numbers
            const actual = formatters.inputPostFormatter({
                from: '0x00000',
                to: '0x00000',
                payload: '0x7b2274657374223a2274657374227d', // {test: 'test'},
                ttl: 200,
                priority: 1000,
                topics: ['hello', 'mytopics'],
                workToProve: 1
            });

            const expected = {
                from: '0x00000',
                to: '0x00000',
                payload: '0x7b2274657374223a2274657374227d',
                ttl: '0xc8',
                priority: '0x3e8',
                topics: ['0x68656c6c6f', '0x6d79746f70696373'],
                workToProve: '0x1'
            };

            assert.deepEqual(actual, expected);
        });
    });
});
