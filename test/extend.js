import { assert } from 'chai';
import FakeHttpProvider from './helpers/FakeIpcProvider';
import Web3 from '../packages/web3';

const web3 = new Web3();

const tests = [
    {
        methods: [
            {
                name: 'getGasPrice2',
                call: 'eth_gasPrice',
                outputFormatter: web3.extend.formatters.outputBigNumberFormatter
            },
            {
                name: 'getBalance',
                call: 'eth_getBalance',
                params: 2,
                inputFormatter: [
                    web3.utils.toChecksumAddress,
                    web3.extend.formatters.inputDefaultBlockNumberFormatter
                ],
                outputFormatter: web3.extend.formatters.outputBigNumberFormatter
            }
        ]
    },
    {
        property: 'admin',
        methods: [
            {
                name: 'getGasPrice3',
                call: 'eth_gasPrice',
                outputFormatter: web3.extend.formatters.outputBigNumberFormatter
            },
            {
                name: 'getBalance',
                call: 'eth_getBalance',
                params: 2,
                inputFormatter: [
                    web3.utils.toChecksumAddress,
                    web3.extend.formatters.inputDefaultBlockNumberFormatter
                ],
                outputFormatter: web3.extend.formatters.outputBigNumberFormatter
            }
        ]
    },
    {
        error: true,
        methods: [
            {
                name: 'getGasPrice4',
                outputFormatter: web3.extend.formatters.outputBigNumberFormatter
            }
        ]
    },
    {
        error: true,
        methods: [
            {
                call: 'eth_gasPrice',
                outputFormatter: web3.extend.formatters.outputBigNumberFormatter
            }
        ]
    }
];

describe('web3', () => {
    describe('extend', () => {
        tests.forEach((test, index) => {
            it(`test no: ${index}`, async () => {
                const provider = new FakeHttpProvider();
                web3.setProvider(provider);

                if (test.error) {
                    assert.throws(web3.extend.bind(web3, test));

                    return;
                }

                web3.extend(test);

                if (test.methods) {
                    const testMethod = property => new Promise((resolve) => {
                        provider.injectResult('0x1234');
                        provider.injectValidation((payload) => {
                            assert.equal(payload.jsonrpc, '2.0');
                            assert.equal(payload.method, property.call);

                            resolve();
                        });

                        if (test.property) {
                            assert.isFunction(web3[test.property][property.name]);
                            web3[test.property][property.name]();
                        } else {
                            assert.isFunction(web3[property.name]);
                            web3[property.name]();
                        }
                    });

                    for (let i = 0; i < test.methods.length; ++i) {
                        // eslint-disable-next-line no-await-in-loop
                        await testMethod(test.methods[i]);
                    }
                }
            });
        });
    });
});
