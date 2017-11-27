import testMethod from './helpers/test.method.js';

const method = 'getCompilers';

const tests = [
    {
        args: [],
        formattedArgs: [],
        result: ['solidity'],
        formattedResult: ['solidity'],
        call: `eth_${method}`
    },
    {
        args: [],
        formattedArgs: [],
        result: ['solidity'],
        formattedResult: ['solidity'],
        call: `eth_${method}`
    }
];

testMethod.runTests('eth', method, tests);
