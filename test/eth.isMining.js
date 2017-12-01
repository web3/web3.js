import testMethod from './helpers/test.method.js';

const method = 'isMining';
const call = 'eth_mining';

const tests = [
    {
        result: true,
        formattedResult: true,
        call
    }
];

testMethod.runTests('eth', method, tests);
