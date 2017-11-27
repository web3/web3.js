import testMethod from './helpers/test.method.js';

const method = 'getWork';

const tests = [
    {
        args: [],
        formattedArgs: [],
        result: true,
        formattedResult: true,
        call: `eth_${method}`
    }
];

testMethod.runTests('eth', method, tests);
