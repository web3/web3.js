import testMethod from './helpers/test.method.js';

const method = 'getBlockNumber';

const tests = [
    {
        result: '0xb',
        formattedResult: 11,
        call: 'eth_blockNumber'
    }
];

testMethod.runTests('eth', method, tests);
