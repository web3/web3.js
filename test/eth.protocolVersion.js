import testMethod from './helpers/test.method.js';

const method = 'getProtocolVersion';
const call = 'eth_protocolVersion';

const tests = [
    {
        result: '12345',
        formattedResult: '12345',
        call
    }
];

testMethod.runTests('eth', method, tests);
