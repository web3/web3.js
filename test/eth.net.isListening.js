import testMethod from './helpers/test.method.js';

const method = 'isListening';

const tests = [
    {
        result: true,
        formattedResult: true,
        call: 'net_listening'
    }
];

testMethod.runTests(['eth', 'net'], method, tests);
