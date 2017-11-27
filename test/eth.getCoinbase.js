import testMethod from './helpers/test.method.js';

const method = 'getCoinbase';

const tests = [
    {
        result: '0x47d33b27bb249a2dbab4c0612bf9caf4c1950855',
        formattedResult: '0x47d33b27bb249a2dbab4c0612bf9caf4c1950855',
        call: 'eth_coinbase'
    }
];

testMethod.runTests('eth', method, tests);
