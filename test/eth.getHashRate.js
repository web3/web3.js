import testMethod from './helpers/test.method.js';

const method = 'getHashrate';

const tests = [
    {
        result: '0x788a8',
        formattedResult: 493736,
        call: 'eth_hashrate'
    }
];

testMethod.runTests('eth', method, tests);
