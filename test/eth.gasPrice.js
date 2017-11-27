import testMethod from './helpers/test.method.js';

const method = 'getGasPrice';
const methodCall = 'eth_gasPrice';

const tests = [
    {
        result: '0x15f90',
        formattedResult: '90000',
        call: methodCall
    }
];

testMethod.runTests('eth', method, tests);
