import _ from 'underscore';
import { assert } from 'chai';
import FakeIpcProvider from './FakeIpcProvider';
import Web3 from '../../packages/web3';

const clone = object => (object ? JSON.parse(JSON.stringify(object)) : []);

const useLocalWallet = (test, provider, web3) => {
    test.useLocalWallet(web3);

    provider.injectResult(1);
    provider.injectValidation((payload) => {
        assert.equal(payload.jsonrpc, '2.0');
        assert.equal(payload.method, 'net_version');
        assert.deepEqual(payload.params, []);
    });

    provider.injectResult('0xa');
    provider.injectValidation((payload) => {
        assert.equal(payload.jsonrpc, '2.0');
        assert.equal(payload.method, 'eth_getTransactionCount');
        assert.deepEqual(payload.params, [test.walletFrom, 'latest']);
    });
};

export default {
    runTests
};

function runTests(obj, method, tests) {
    let objName;

    if (_.isArray(obj)) {
        objName = obj.join('.');
    } else {
        objName = obj;
    }

    const testName = objName ? `web3.${objName}` : 'web3';

    describe(testName, () => {
        describe(method, () => {
            tests.forEach((test, index) => {
                it(`promise test: ${index}`, async () => {
                    // given
                    let w3;
                    const provider = new FakeIpcProvider();
                    const web3 = new Web3(provider);

                    // add a wallet
                    if (test.useLocalWallet) {
                        useLocalWallet(test, provider, web3);
                    }

                    provider.injectResult(clone(test.result));
                    provider.injectValidation((payload) => {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, test.call);
                        assert.deepEqual(payload.params, test.formattedArgs || []);
                    });

                    if (test.call2) {
                        provider.injectResult(clone(test.result2));
                        provider.injectValidation((payload) => {
                            assert.equal(payload.jsonrpc, '2.0');
                            assert.equal(payload.method, test.call2);
                            assert.deepEqual(payload.params, test.formattedArgs2 || []);
                        });
                    }

                    // if notification its sendTransaction, which needs two more results,
                    // subscription and receipt
                    if (test.notification) {
                        provider.injectResult(null);
                        provider.injectValidation((payload) => {
                            assert.equal(payload.method, 'eth_getTransactionReceipt');
                        });

                        provider.injectResult(clone(test.result));
                        // inject receipt
                        provider.injectResult({
                            blockHash: '0x6fd9e2a26ab',
                            blockNumber: '0x15df',
                            transactionHash: '0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b',
                            transactionIndex: '0x1',
                            contractAddress: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
                            cumulativeGasUsed: '0x7f110',
                            gasUsed: '0x7f110'
                        });
                        // fake newBlock
                        provider.injectNotification(test.notification);
                    }

                    const args = clone(test.args);

                    if (test.error) {
                        if (obj) {
                            if (_.isArray(obj)) {
                                w3 = web3[obj[0]][obj[1]];
                            } else {
                                w3 = web3[obj];
                            }

                            assert.throws(() => {
                                w3[method](...args);
                            });
                        } else {
                            assert.throws(() => {
                                web3[method](...args);
                            });
                        }

                        return;
                    }

                    let result;
                    if (obj) {
                        if (_.isArray(obj)) {
                            w3 = web3[obj[0]][obj[1]];
                        } else {
                            w3 = web3[obj];
                        }

                        result = await w3[method](...args);
                    } else {
                        result = await web3[method](...args);
                    }

                    if (test.notification) {
                        // test receipt
                        assert.deepEqual(result, {
                            blockHash: '0x6fd9e2a26ab',
                            blockNumber: 5599,
                            transactionHash: '0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b',
                            transactionIndex: 1,
                            contractAddress: '0x407D73d8a49eeb85D32Cf465507dd71d507100c1', // checksum address
                            cumulativeGasUsed: 520464,
                            gasUsed: 520464
                        });
                    } else {
                        assert.deepEqual(result, test.formattedResult);
                    }
                });

                it(`callback test: ${index}`, (done) => {
                    // given
                    let w3;
                    const provider = new FakeIpcProvider();
                    const web3 = new Web3(provider);

                    // add a wallet
                    if (test.useLocalWallet) {
                        useLocalWallet(test, provider, web3);
                    }

                    provider.injectResult(clone(test.result));
                    provider.injectValidation((payload) => {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, test.call);
                        assert.deepEqual(payload.params, test.formattedArgs || []);
                    });

                    if (test.call2) {
                        provider.injectResult(clone(test.result2));
                        provider.injectValidation((payload) => {
                            assert.equal(payload.jsonrpc, '2.0');
                            assert.equal(payload.method, test.call2);
                            assert.deepEqual(payload.params, test.formattedArgs2 || []);
                        });
                    }

                    const args = clone(test.args);

                    if (test.error) {
                        if (obj) {
                            if (_.isArray(obj)) {
                                w3 = web3[obj[0]][obj[1]];
                            } else {
                                w3 = web3[obj];
                            }

                            assert.throws(() => {
                                w3[method](...args);
                            });
                        } else {
                            assert.throws(() => {
                                web3[method](...args);
                            });
                        }

                        done();
                    } else {
                        // add callback
                        args.push((_err, result) => {
                            assert.deepEqual(result, test.formattedResult);

                            done();
                        });

                        // when
                        if (obj) {
                            if (_.isArray(obj)) {
                                w3 = web3[obj[0]][obj[1]];
                            } else {
                                w3 = web3[obj];
                            }

                            w3[method](...args);
                        } else {
                            web3[method](...args);
                        }
                    }
                });
            });
        });
    });
}
