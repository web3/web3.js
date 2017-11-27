import { assert } from 'chai';

import formatters from '../packages/web3-core-helpers/src/formatters.js';
import FakeIpcProvider from './helpers/FakeIpcProvider';
import Eth from '../packages/web3-eth';
import Method from '../packages/web3-core-method';

const address = '0x1234567890123456789012345678901234567891';

describe('lib/web3/method', () => {
    describe('buildCall', () => {
        it('should return a promise and resolve it', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const method = new Method({
                name: 'call',
                call: 'eth_call',
                params: 2,
                inputFormatter: [
                    formatters.inputCallFormatter,
                    formatters.inputDefaultBlockNumberFormatter.bind({ defaultBlock: 'latest' })
                ]
            });
            method.setRequestManager(eth._requestManager);

            // generate send function
            const send = method.buildCall();

            // add results
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    data: '0xa123456'
                }, 'latest']);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456'
            }).then((result) => {
                assert.deepEqual(result, '0x1234567453543456321456321');

                done();
            });
        });

        it('should return a promise and fail it', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const method = new Method({
                name: 'call',
                call: 'eth_call',
                params: 2,
                inputFormatter: [formatters.inputCallFormatter, formatters.inputDefaultBlockNumberFormatter.bind({ defaultBlock: 'latest' })]
            });
            method.setRequestManager(eth._requestManager);

            // generate send function
            const send = method.buildCall();

            // add results
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    data: '0xa123456'
                }, 'latest']);
            });
            provider.injectError({
                message: 'Wrong!',
                code: 1234
            });

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456'
            })
                .catch((error) => {
                    assert.deepEqual(error, {
                        message: 'Wrong!',
                        code: 1234
                    });

                    done();
                });
        });

        it('should return an error, if the outputFormatter returns an error', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const method = new Method({
                name: 'call',
                call: 'eth_call',
                params: 2,
                inputFormatter: [formatters.inputCallFormatter, formatters.inputDefaultBlockNumberFormatter.bind({ defaultBlock: 'latest' })],
                outputFormatter(_result) {
                    return new Error('Error!');
                }
            });
            method.setRequestManager(eth._requestManager);

            // generate send function
            const send = method.buildCall();

            // add results
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    data: '0xa123456'
                }, 'latest']);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456'
            }, (err, result) => {
                assert.isTrue(err instanceof Error);
                assert.isUndefined(result);

                done();
            });
        });

        it('should return an error, if the outputFormatter throws', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const method = new Method({
                name: 'call',
                call: 'eth_call',
                params: 2,
                inputFormatter: [formatters.inputCallFormatter, formatters.inputDefaultBlockNumberFormatter.bind({ defaultBlock: 'latest' })],
                outputFormatter(_result) {
                    throw new Error('Error!');
                }
            });
            method.setRequestManager(eth._requestManager);

            // generate send function
            const send = method.buildCall();

            // add results
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    data: '0xa123456'
                }, 'latest']);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456'
            }, (err, result) => {
                assert.isTrue(err instanceof Error);
                assert.isUndefined(result);

                done();
            });
        });

        it('should fill in gasPrice if not given', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);

            // generate send function
            const send = method.buildCall();

            // add results
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_gasPrice');
                assert.deepEqual(payload.params, []);
            });
            provider.injectResult('0xffffdddd'); // gas price

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    data: '0xa123456',
                    gasPrice: '0xffffdddd'
                }]);

                done();
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456'
            });
        });

        const succeedOnReceipt = () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);

            // generate send function
            const send = method.buildCall();

            // add results
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    value: '0xa',
                    gasPrice: '0x574d94bba'
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });
            provider.injectResult(null);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult('0x1234567'); // subscription id

            // fake newBlock
            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x1234567',
                    result: {
                        blockNumber: '0x10'
                    }
                }
            });

            // receipt
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });
            provider.injectResult({
                contractAddress: address,
                cumulativeGasUsed: '0xa',
                transactionIndex: '0x3',
                blockNumber: '0xa',
                blockHash: '0xafff',
                gasUsed: '0x0'
            });

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_unsubscribe');
                assert.deepEqual(payload.params, ['0x1234567']);
            });
            provider.injectResult(true); // unsubscribe result

            return send;
        };

        it('should use promise "then" when subscribing and checking for receipt if "sendTransaction"', (done) => {
            const send = succeedOnReceipt();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                value: '0xa',
                gasPrice: '23435234234'
            }).then((result) => {
                assert.deepEqual(result, {
                    contractAddress: address,
                    cumulativeGasUsed: 10,
                    transactionIndex: 3,
                    blockNumber: 10,
                    blockHash: '0xafff',
                    gasUsed: 0
                });

                done();
            });
        });

        it('should use on("receipt", ...) when subscribing and checking for receipt if "sendTransaction"', (done) => {
            const send = succeedOnReceipt();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                value: '0xa',
                gasPrice: '23435234234'
            }).on('receipt', (result) => {
                assert.deepEqual(result, {
                    contractAddress: address,
                    cumulativeGasUsed: 10,
                    transactionIndex: 3,
                    blockNumber: 10,
                    blockHash: '0xafff',
                    gasUsed: 0
                });

                done();
            });
        });

        const succeedwhenDeploying = () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager); // second parameter accounts

            // generate send function
            const send = method.buildCall();

            // add results
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    data: '0xa123456',
                    gasPrice: '0x574d94bba'
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });
            provider.injectResult(null);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult('0x1234567'); // subscription id

            // fake newBlock
            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x1234567',
                    result: {
                        blockNumber: '0x10'
                    }
                }
            });

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });
            // receipt
            provider.injectResult({
                contractAddress: address,
                cumulativeGasUsed: '0xa',
                transactionIndex: '0x3',
                blockNumber: '0xa',
                blockHash: '0xafff',
                gasUsed: '0x0'
            });
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getCode');
                assert.deepEqual(payload.params, [address, 'latest']);
            });
            // code result
            provider.injectResult('0x321');

            return send;
        };

        it('should use promise "then" when subscribing and checking for receipt and code if "sendTransaction" deploying contract', (done) => {
            const send = succeedwhenDeploying();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).then((result) => {
                assert.deepEqual(result, {
                    contractAddress: address,
                    cumulativeGasUsed: 10,
                    transactionIndex: 3,
                    blockNumber: 10,
                    blockHash: '0xafff',
                    gasUsed: 0
                });

                done();
            });
        });

        it('should use on("receipt", ...) when subscribing and checking  for receipt and code if "sendTransaction" deploying contract', (done) => {
            const send = succeedwhenDeploying();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).on('receipt', (result) => {
                assert.deepEqual(result, {
                    contractAddress: address,
                    cumulativeGasUsed: 10,
                    transactionIndex: 3,
                    blockNumber: 10,
                    blockHash: '0xafff',
                    gasUsed: 0
                });

                done();
            });
        });

        const failOnCodeEmpty = () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);

            // generate send function
            const send = method.buildCall();

            // add results
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    data: '0xa123456',
                    gasPrice: '0x574d94bba'
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });
            provider.injectResult(null);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult('0x1234567'); // subscription id

            // fake newBlock
            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x1234567',
                    result: {
                        blockNumber: '0x10'
                    }
                }
            });

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });
            // receipt
            provider.injectResult({
                contractAddress: address,
                cumulativeGasUsed: '0xa',
                transactionIndex: '0x3',
                blockNumber: '0xa',
                blockHash: '0xafff',
                gasUsed: '0x0'
            });
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getCode');
                assert.deepEqual(payload.params, [address, 'latest']);
            });
            // code result
            provider.injectResult('0x');

            return send;
        };

        it('should fail on promise when subscribing and check for receipt and code if "sendTransaction" and deploying contract: error if code is empty', (done) => {
            const send = failOnCodeEmpty();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).catch((error) => {
                assert.instanceOf(error, Error);
                done();
            });
        });

        it('should fail with on("error", ...) when subscribing and check for receipt and code if "sendTransaction" and deploying contract: error if code is empty', (done) => {
            const send = failOnCodeEmpty();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).on('error', (error) => {
                assert.instanceOf(error, Error);
                done();
            });
        });

        const failOnMissingAddress = () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);

            // generate send function
            const send = method.buildCall();

            // add results
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    data: '0xa123456',
                    gasPrice: '0x574d94bba'
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });
            provider.injectResult(null);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult('0x1234567'); // subscription id

            // fake newBlock
            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x1234567',
                    result: {
                        blockNumber: '0x10'
                    }
                }
            });

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });
            // receipt
            provider.injectResult({
                contractAddress: null,
                cumulativeGasUsed: '0xa',
                transactionIndex: '0x3',
                blockNumber: '0xa',
                blockHash: '0xafff',
                gasUsed: '0x0'
            });
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_unsubscribe');
                assert.deepEqual(payload.params, ['0x1234567']);
            });
            // code result
            provider.injectResult(true);

            return send;
        };

        it('should fail on promise when subscribing and check for receipt and code if "sendTransaction" and deploying contract: error if receipt has no contract address', (done) => {
            const send = failOnMissingAddress();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).catch((error) => {
                assert.instanceOf(error, Error);
                done();
            });
        });

        it('should fail with on("error", ...) when subscribing and check for receipt and code if "sendTransaction" and deploying contract: error if receipt has no contract address', (done) => {
            const send = failOnMissingAddress();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).on('error', (error) => {
                assert.instanceOf(error, Error);
            }).catch((error) => {
                // also run catch!
                assert.instanceOf(error, Error);
                done();
            });
        });

        const failOnTimeout = () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);

            // generate send function
            const send = method.buildCall();

            // add results
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    data: '0xa123456',
                    gasPrice: '0x574d94bba'
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });
            provider.injectResult(null);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult('0x1234567'); // subscription id

            // fire 50 fake newBlocks
            for (let i = 0; i < 51; i++) {
                setTimeout(() => {
                    provider.injectNotification({
                        method: 'eth_subscription',
                        params: {
                            subscription: '0x1234567',
                            result: {
                                blockNumber: '0x10'
                            }
                        }
                    });
                }, i);

                // receipt
                provider.injectResult(null);
            }

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });

            return send;
        };

        it('should fail with promise when subscribing and check for receipt and code if "sendTransaction" and deploying contract: if not receipt after 50 blocks', (done) => {
            const send = failOnTimeout();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).catch((error) => {
                assert.instanceOf(error, Error);
                done();
            });
        });

        it('should fail with on("error", ...) when subscribing and check for receipt and code if "sendTransaction" and deploying contract: if not receipt after 50 blocks', (done) => {
            const send = failOnTimeout();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).on('error', (error) => {
                assert.instanceOf(error, Error);
                done();
            });
        });

        it('should give confirmation receipts with on("confirmation", ...) when subscribing "sendTransaction"', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);

            // generate send function
            const send = method.buildCall();

            // add results
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    gasPrice: '0x574d94bba'
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });
            provider.injectResult(null);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult('0x1234567'); // subscription id

            // fire 50 fake newBlocks
            for (let i = 0; i < 30; i++) {
                setTimeout(() => {
                    provider.injectNotification({
                        method: 'eth_subscription',
                        params: {
                            subscription: '0x1234567',
                            result: {
                                blockNumber: '0x10'
                            }
                        }
                    });
                }, i);

                // receipt
                provider.injectResult({
                    contractAddress: null,
                    cumulativeGasUsed: '0xa',
                    transactionIndex: '0x3',
                    blockNumber: '0xa',
                    blockHash: '0xafff',
                    gasUsed: '0x0'
                });
            }

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });

            let countConf = 0;

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                gasPrice: '23435234234'
            })
                .on('transactionHash', (result) => {
                    assert.deepEqual(result, '0x1234567453543456321456321');
                })
                .on('receipt', (result) => {
                    assert.deepEqual(result, {
                        contractAddress: null,
                        cumulativeGasUsed: 10,
                        transactionIndex: 3,
                        blockNumber: 10,
                        blockHash: '0xafff',
                        gasUsed: 0
                    });
                })
                .on('confirmation', (conf, receipt) => {
                    assert.deepEqual(receipt, {
                        contractAddress: null,
                        cumulativeGasUsed: 10,
                        transactionIndex: 3,
                        blockNumber: 10,
                        blockHash: '0xafff',
                        gasUsed: 0
                    });

                    assert.deepEqual(conf, countConf);

                    countConf++;

                    if (conf === 12) {
                        done();
                    }
                });
        });
    });
});
