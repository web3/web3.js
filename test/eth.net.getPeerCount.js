import testMethod from './helpers/test.method.js';

const method = 'getPeerCount';

const tests = [
    {
        result: '0xf',
        formattedResult: 15,
        call: 'net_peerCount'
    }
];

testMethod.runTests(['eth', 'net'], method, tests);
