import testMethod from './helpers/test.method.js';

const method = 'estimateGas';

const tests = [
    {
        args: [
            {
                to: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                data: '0x23455654',
                gas: 11,
                gasPrice: 11
            }
        ],
        formattedArgs: [
            {
                to: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                data: '0x23455654',
                gas: '0xb',
                gasPrice: '0xb'
            }
        ],
        result: '0x31981',
        formattedResult: 203137,
        call: `eth_${method}`
    }
];

testMethod.runTests('eth', method, tests);
