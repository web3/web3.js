import _ from 'lodash';
import { assert } from 'chai';
import testMethod from './helpers/test.method.js';
import FakeHttpProvider from './helpers/FakeHttpProvider';
import Web3 from '../packages/web3';

const method = 'sendTransaction';

const tests = [
    {
        args: [{
            from: '0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6', // checksum address
            to: '0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6', // checksum address
            value: '1234567654321',
            gasPrice: '324234234234'
        }],
        formattedArgs: [{
            from: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
            to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
            value: '0x11f71f76bb1',
            gasPrice: '0x4b7dddc97a'
        }],
        result: '0x1234567',
        formattedResult: '0x1234567',
        notification: {
            method: 'eth_subscription',
            params: {
                subscription: '0x1234567',
                result: {
                    blockNumber: '0x10'
                }
            }
        },
        call: `eth_${method}`
    },
    {
        // test with gasPrice missing
        args: [{
            from: '0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6', // checksum address
            to: '0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6', // checksum address
            value: '1234567654321'
        }],
        notification: {
            method: 'eth_subscription',
            params: {
                subscription: '0x1234567',
                result: {
                    blockNumber: '0x10'
                }
            }
        },
        call: 'eth_gasPrice',
        formattedArgs: [],
        result: '0x1234567',
        formattedResult: '0x1234567',

        call2: `eth_${method}`,
        formattedArgs2: [{
            from: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
            to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
            value: '0x11f71f76bb1',
            gasPrice: '0x1234567'
        }],
        result2: '0x1234567'
    },
    {
        args: [{
            from: '0XDBDBDB2CBD23B783741E8D7FCF51E459B497E4A6',
            to: '0XDBDBDB2CBD23B783741E8D7FCF51E459B497E4A6',
            value: '1234567654321',
            data: '0x213453ffffff',
            gasPrice: '324234234234'
        }],
        formattedArgs: [{
            from: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
            to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
            value: '0x11f71f76bb1',
            data: '0x213453ffffff',
            gasPrice: '0x4b7dddc97a'
        }],
        result: '0x12345678976543213456786543212345675432',
        formattedResult: '0x12345678976543213456786543212345675432',
        notification: {
            method: 'eth_subscription',
            params: {
                subscription: '0x12345678976543213456786543212345675432',
                result: {
                    blockNumber: '0x10'
                }
            }
        },
        call: `eth_${method}`
    },
    {
        args: [{
            from: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS', // iban address
            to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
            value: '1234567654321',
            gasPrice: '324234234234'
        }],
        formattedArgs: [{
            from: '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8',
            to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
            value: '0x11f71f76bb1',
            gasPrice: '0x4b7dddc97a'
        }],
        result: '0x12345678976543213456786543212345675432',
        formattedResult: '0x12345678976543213456786543212345675432',
        notification: {
            method: 'eth_subscription',
            params: {
                subscription: '0x12345678976543213456786543212345675432',
                result: {
                    blockNumber: '0x10'
                }
            }
        },
        call: `eth_${method}`
    },
    {
        useLocalWallet(web3) {
            web3.eth.accounts.wallet.add('0xd7d364e720c129acb940439a84a99185dd55af6f6d105018a8acfb7f8c008142');
        },
        walletFrom: '0x5af0838657202f865A4547b5eD28a64f799960DC',
        args: [{
            from: '0x5af0838657202f865A4547b5eD28a64f799960DC',
            to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
            value: '1234567654321',
            gasPrice: '324234234234',
            gas: 500000
        }],
        formattedArgs: ['0xf86b0a854b7dddc97a8307a12094dbdbdb2cbd23b783741e8d7fcf51e459b497e4a686011f71f76bb18026a0ce66ccabda889012314677073ded7bec9f763e564dfcff1135e7c6a3c5b89353a07bfa06fe1ba3f1804e4677295a5147e6c8b2224647cc2b7b62063081f6490bd3'],
        result: '0x12345678976543213456786543212345675432',
        formattedResult: '0x12345678976543213456786543212345675432',
        notification: {
            method: 'eth_subscription',
            params: {
                subscription: '0x12345678976543213456786543212345675432',
                result: {
                    blockNumber: '0x10'
                }
            }
        },
        call: 'eth_sendRawTransaction'
    },
    {
        useLocalWallet(web3) {
            web3.eth.accounts.wallet.add('0xf7d364e720c129acb940439a84a99185dd55af6f6d105018a8acfb7f8c008142');
        },
        walletFrom: '0xE2873A6bE9Bc50E70dE4295d968459d4aCF515C0',
        args: [{
            from: 0,
            to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
            value: '1234567654321',
            gasPrice: '324234234234',
            gas: 500000
        }],
        formattedArgs: ['0xf86b0a854b7dddc97a8307a12094dbdbdb2cbd23b783741e8d7fcf51e459b497e4a686011f71f76bb18026a0fe620c94cc14fdcdef494a40caf9e2860d1a5929d95730e1b7a6a2041c9c507fa01d3d22e7ab1010fa95a357322ad14a8ce1b1b631d3bb9c123922ff8042c8fc8b'],
        result: '0x12345678976543213456786543212345675432',
        formattedResult: '0x12345678976543213456786543212345675432',
        notification: {
            method: 'eth_subscription',
            params: {
                subscription: '0x12345678976543213456786543212345675432',
                result: {
                    blockNumber: '0x10'
                }
            }
        },
        call: 'eth_sendRawTransaction'
    },
    {
        useLocalWallet(web3) {
            web3.eth.accounts.wallet.add('0xa1d364e720c129acb940439a84a99185dd55af6f6d105018a8acfb7f8c008142');
        },
        walletFrom: '0xF65a29341Fd9F8357e060f2e21Bf3407062f2A46',
        args: [{
            from: {
                address: '0xF65a29341Fd9F8357e060f2e21Bf3407062f2A46',
                privateKey: '0xa1d364e720c129acb940439a84a99185dd55af6f6d105018a8acfb7f8c008142'
            },
            to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
            value: '1234567654321',
            gasPrice: '324234234234',
            gas: 500000
        }],
        formattedArgs: ['0xf86b0a854b7dddc97a8307a12094dbdbdb2cbd23b783741e8d7fcf51e459b497e4a686011f71f76bb18026a016a5bc4e1808e60a5d370f6b335be158673bd95c457ee7925dc8ae1bec69647fa03831c5e0a966a0aad0c67d6ddea55288f76ae1d73dfe11c6174a8682c2ec165d'],
        result: '0x12345678976543213456786543212345675432',
        formattedResult: '0x12345678976543213456786543212345675432',
        notification: {
            method: 'eth_subscription',
            params: {
                subscription: '0x12345678976543213456786543212345675432',
                result: {
                    blockNumber: '0x10'
                }
            }
        },
        call: 'eth_sendRawTransaction'
    },
    {
        error: true, // only for testing
        args: [{
            from: 'XE81ETHXREGGAVOFYORK', // iban address
            to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
            value: '1234567654321'
        }],
        call: `eth_${method}`
    }
];

testMethod.runTests('eth', method, tests);

class TestHarness {
    constructor(test) {
        this.test = _.cloneDeep(test);
        this.args = this.test.args;

        this.provider = new FakeHttpProvider();
        this.web3 = new Web3(this.provider);
    }

     configure = () => {
         this.provider.injectResult(this.test.result);
         this.provider.injectValidation((payload) => {
             assert.equal(payload.jsonrpc, '2.0');
             assert.equal(payload.method, this.test.call);
             assert.deepEqual(payload.params, this.test.formattedArgs || []);
         });

         if (this.test.call2) {
             this.provider.injectResult(this.test.result2);
             this.provider.injectValidation((payload) => {
                 assert.equal(payload.jsonrpc, '2.0');
                 assert.equal(payload.method, this.test.call2);
                 assert.deepEqual(payload.params, this.test.formattedArgs2 || []);
             });
         }

         this.provider.injectResult(null);
         this.provider.injectValidation((payload) => {
             assert.equal(payload.method, 'eth_getTransactionReceipt');
         });

         // if notification its sendTransaction,
         // which needs two more results, subscription and receipt
         if (this.test.notification) {
             // inject receipt
             this.provider.injectResult({
                 blockHash: '0x6fd9e2a26ab',
                 blockNumber: '0x15df',
                 transactionHash: '0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b',
                 transactionIndex: '0x1',
                 contractAddress: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
                 cumulativeGasUsed: '0x7f110',
                 gasUsed: '0x7f110'
             });
         }
     }

    runTestForErrors = () => {
        assert.throws(() => {
            this.web3.eth[method].apply(this.web3, this.args);
        });
    }

    runTestWithPromise = async () => {
        const result = await this.web3.eth[method].apply(this.web3, this.args);

        return result;
    }

    runTestWithCallback = () => new Promise((resolve) => {
        // add callback
        this.args.push((err, result) => {
            assert.isNull(err);

            resolve(result);
        });

        this.web3.eth[method].apply(this.web3, this.args);
    })

    verifyResult = (result, isCallback = false) => {
        if (!isCallback && this.test.notification) {
            assert.deepEqual(result, {
                blockHash: '0x6fd9e2a26ab',
                blockNumber: 5599,
                transactionHash: '0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b',
                transactionIndex: 1,
                contractAddress: '0x407D73d8a49eeb85D32Cf465507dd71d507100c1', // checksum address
                cumulativeGasUsed: 520464,
                gasUsed: 520464
            });

            return;
        }

        assert.deepEqual(result, this.test.formattedResult);
    }
}

describe(method, () => {
    tests.forEach((test, index) => {
        it(`promise test: ${index}`, async () => {
            if (test.useLocalWallet) {
                return;
            }

            const harness = new TestHarness(test);
            harness.configure();

            if (test.error) {
                harness.runTestForErrors();

                return;
            }

            const result = await harness.runTestWithPromise();
            harness.verifyResult(result);
        });

        it(`callback test: ${index}`, async () => {
            if (test.useLocalWallet) {
                return;
            }

            const harness = new TestHarness(test);
            harness.configure();

            if (test.error) {
                harness.runTestForErrors();

                return;
            }

            const result = await harness.runTestWithCallback();
            harness.verifyResult(result, true);
        });
    });
});
