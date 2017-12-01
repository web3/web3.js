import { assert } from 'chai';
import Promise from 'bluebird';
import Eth from '../packages/web3-eth';
import { sha3 } from '../packages/web3-utils';
import FakeIpcProvider from './helpers/FakeIpcProvider';
import FakeHttpProvider from './helpers/FakeHttpProvider';

const abi = [{
    type: 'constructor',
    inputs: [{
        name: 'who',
        type: 'address'
    }, {
        name: 'myValue',
        type: 'uint256'
    }]
}, {
    name: 'balance',
    type: 'function',
    inputs: [{
        name: 'who',
        type: 'address'
    }],
    constant: true,
    outputs: [{
        name: 'value',
        type: 'uint256'
    }]
}, {
    name: 'hasALotOfParams',
    inputs: [
        {
            name: '_var1',
            type: 'bytes32'
        },
        {
            name: '_var2',
            type: 'string'
        },
        {
            name: '_var3',
            type: 'bytes32[]'
        }
    ],
    outputs: [
        {
            name: 'owner',
            type: 'address'
        }
    ],
    constant: false,
    payable: false,
    type: 'function'
}, {
    name: 'getStr',
    type: 'function',
    inputs: [],
    constant: true,
    outputs: [{
        name: 'myString',
        type: 'string'
    }]
}, {
    name: 'owner',
    type: 'function',
    inputs: [],
    constant: true,
    outputs: [{
        name: 'owner',
        type: 'address'
    }]
}, {
    name: 'mySend',
    type: 'function',
    inputs: [{
        name: 'to',
        type: 'address'
    }, {
        name: 'value',
        type: 'uint256'
    }],
    outputs: [],
    payable: true
}, {
    name: 'myDisallowedSend',
    type: 'function',
    inputs: [{
        name: 'to',
        type: 'address'
    }, {
        name: 'value',
        type: 'uint256'
    }],
    outputs: [],
    payable: false
}, {
    name: 'testArr',
    type: 'function',
    inputs: [{
        name: 'value',
        type: 'int[]'
    }],
    constant: true,
    outputs: [{
        name: 'd',
        type: 'int'
    }]
}, {
    name: 'Changed',
    type: 'event',
    inputs: [
        { name: 'from', type: 'address', indexed: true },
        { name: 'amount', type: 'uint256', indexed: true },
        { name: 't1', type: 'uint256', indexed: false },
        { name: 't2', type: 'uint256', indexed: false }
    ]
}, {
    name: 'Unchanged',
    type: 'event',
    inputs: [
        { name: 'value', type: 'uint256', indexed: true },
        { name: 'addressFrom', type: 'address', indexed: true },
        { name: 't1', type: 'uint256', indexed: false }
    ]
}];

const address = '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe';
const addressLowercase = '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae';
const address2 = '0x5555567890123456789012345678901234567891';

describe('contract', () => {
    describe('instantiation', () => {
        it('should transform address from checksum addressess', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            const contract = new eth.Contract(abi, address);

            assert.equal(contract.options.address, address);
        });

        it('should transform address to checksum address', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            const contract = new eth.Contract(abi, addressLowercase);

            assert.equal(contract.options.address, address);
        });

        it('should fail on invalid address', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            const test = () => new eth.Contract(abi, '0x11F4D0A3c12e86B4b5F39B213F7E19D048276DAe');

            assert.throws(test);
        });

        it('should fail on invalid address as options.from', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            const test = () => new eth.Contract(abi, address, { from: '0x11F4D0A3c12e86B4b5F39B213F7E19D048276DAe' });

            assert.throws(test);
        });

        it('.clone() should properly clone the contract instance', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const fromAddress = '0xDDfFD0A3C12e86b4b5f39B213f7e19d048276daE';
            const abi2 = [{
                name: 'ballerRo',
                type: 'function',
                inputs: [{
                    name: 'So',
                    type: 'address'
                }],
                constant: true,
                outputs: [{
                    name: 'man',
                    type: 'uint256'
                }]
            }];

            const contract1 = new eth.Contract(abi, address, {
                gas: 1222,
                gasPrice: 12345678,
                from: fromAddress
            });
            const contract2 = contract1.clone();

            assert.equal(contract1.options.address, address);
            assert.equal(contract1.options.gas, 1222);
            assert.equal(contract1.options.gasPrice, '12345678');
            assert.deepEqual(contract1.options.jsonInterface, abi);

            contract2.options.jsonInterface = abi2;
            contract2.options.address = fromAddress;
            contract2.options.gas = 300;
            contract2.options.gasPrice = '234234';

            assert.isFunction(contract2.methods.ballerRo);
            assert.equal(contract2.options.address, fromAddress);
            assert.equal(contract2.options.gas, 300);
            assert.equal(contract2.options.gasPrice, '234234');
            assert.deepEqual(contract2.options.jsonInterface, abi2);
        });
    });

    describe('internal method', () => {
        it('_encodeEventABI should return the encoded event object without topics', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            const contract = new eth.Contract(abi, address);

            const result = contract._encodeEventABI({
                signature: '0x1234',
                name: 'Changed',
                type: 'event',
                inputs: [
                    { name: 'from', type: 'address', indexed: true },
                    { name: 'amount', type: 'uint256', indexed: true },
                    { name: 't1', type: 'uint256', indexed: false },
                    { name: 't2', type: 'uint256', indexed: false }
                ]
            });

            assert.deepEqual(result, {
                address: addressLowercase,
                topics: [
                    '0x1234',
                    null,
                    null
                ]
            });
        });

        it('_encodeEventABI should return the encoded event object with topics', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            const contract = new eth.Contract(abi, address);

            const result = contract._encodeEventABI({
                signature: '0x1234',
                name: 'Changed',
                type: 'event',
                inputs: [
                    { name: 'from', type: 'address', indexed: true },
                    { name: 'amount', type: 'uint256', indexed: true },
                    { name: 't1', type: 'uint256', indexed: false },
                    { name: 't2', type: 'uint256', indexed: false }
                ]
            }, { filter: { amount: 12 }, fromBlock: 2 });

            assert.deepEqual(result, {
                address: addressLowercase,
                fromBlock: '0x2',
                topics: [
                    '0x1234',
                    null,
                    '0x000000000000000000000000000000000000000000000000000000000000000c'
                ]
            });
        });

        it('_encodeEventABI should return the encoded event object with topics and multiple choices', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            const contract = new eth.Contract(abi, address);

            const result = contract._encodeEventABI({
                signature: '0x1234',
                name: 'Changed',
                type: 'event',
                inputs: [
                    { name: 'test', type: 'uint256', indexed: true },
                    { name: 'from', type: 'address', indexed: true },
                    { name: 'amount', type: 'uint256', indexed: true },
                    { name: 't1', type: 'uint256', indexed: false },
                    { name: 't2', type: 'uint256', indexed: false }
                ]
            }, { filter: { amount: [12, 10], from: address }, fromBlock: 2 });

            assert.deepEqual(result, {
                address: addressLowercase,
                fromBlock: '0x2',
                topics: [
                    '0x1234',
                    null,
                    `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                    [
                        '0x000000000000000000000000000000000000000000000000000000000000000c',
                        '0x000000000000000000000000000000000000000000000000000000000000000a'
                    ]
                ]
            });
        });

        it('_decodeEventABI should return the decoded event object with topics', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'Changed(address,uint256,uint256,uint256)';

            const contract = new eth.Contract(abi, address);

            const result = contract._decodeEventABI.call({
                signature: sha3(signature),
                name: 'Changed',
                type: 'event',
                inputs: [
                    { name: 'from', type: 'address', indexed: true },
                    { name: 'amount', type: 'uint256', indexed: true },
                    { name: 't1', type: 'uint256', indexed: false },
                    { name: 't2', type: 'uint256', indexed: false }
                ]
            }, {
                address,
                topics: [
                    sha3(signature),
                    `0x000000000000000000000000${address.replace('0x', '')}`,
                    '0x0000000000000000000000000000000000000000000000000000000000000001'
                ],
                blockNumber: '0x3',
                transactionHash: '0x1234',
                blockHash: '0x1345',
                transactionIndex: '0x0',
                logIndex: '0x4',
                data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                '0000000000000000000000000000000000000000000000000000000000000008'
            });

            assert.equal(result.blockNumber, 3);
            assert.equal(result.blockHash, '0x1345');
            assert.equal(result.logIndex, 4);
            assert.equal(result.id, 'log_9ff24cb4');
            assert.equal(result.transactionIndex, 0);
            assert.equal(result.returnValues.from, address);
            assert.equal(result.returnValues.amount, 1);
            assert.equal(result.returnValues.t1, 1);
            assert.equal(result.returnValues.t2, 8);
        });

        it('_decodeMethodReturn should return the decoded values', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            const contract = new eth.Contract(abi, address);

            const result = contract._decodeMethodReturn([{
                name: 'myAddress',
                type: 'address'
            }, {
                name: 'value',
                type: 'uint256'
            }], `0x000000000000000000000000${address.replace('0x', '')
            }000000000000000000000000000000000000000000000000000000000000000a`);

            assert.isObject(result);
            assert.equal(result[0], address);
            assert.equal(result.myAddress, address);
            assert.equal(result[1], 10);
            assert.equal(result.value, 10);
        });

        it('_decodeMethodReturn should return a single decoded value', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            const contract = new eth.Contract(abi, address);

            const result = contract._decodeMethodReturn([{
                name: 'myAddress',
                type: 'address'
            }], `0x000000000000000000000000${address.replace('0x', '')}`);

            assert.equal(result, address);
        });

        it('_executeMethod as instantSealEngine should sendTransaction and check for receipts', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = sha3('mySend(address,uint256)').slice(0, 10);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: `${signature}000000000000000000000000${addressLowercase.replace('0x', '')}000000000000000000000000000000000000000000000000000000000000000a`,
                    from: address2,
                    to: addressLowercase,
                    gasPrice: '0x5af3107a4000'
                }]);
            });
            provider.injectResult('0x1234000000000000000000000000000000000000000000000000000000056789');

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234000000000000000000000000000000000000000000000000000000056789']);
            });

            // with instant seal we get the receipt right away
            provider.injectResult({
                contractAddress: addressLowercase,
                cumulativeGasUsed: '0xa',
                transactionIndex: '0x3',
                blockNumber: '0xa',
                blockHash: '0xbf1234',
                gasUsed: '0x0'
            });

            const contract = new eth.Contract(abi, address);

            const txObject = {};
            txObject._method = {
                signature,
                name: 'send',
                type: 'function',
                inputs: [{
                    name: 'to',
                    type: 'address'
                }, {
                    name: 'value',
                    type: 'uint256'
                }],
                outputs: []
            };
            txObject._parent = contract;
            txObject.encodeABI = contract._encodeMethodABI.bind(txObject);
            txObject.arguments = [address, 10];

            contract._executeMethod.call(txObject, 'send', { from: address2, gasPrice: '100000000000000' }, (err, result) => {
                // tx hash
                assert.isNull(err);
                assert.equal(result, '0x1234000000000000000000000000000000000000000000000000000000056789');
            })
                .on('receipt', (result) => {
                    assert.deepEqual(result, {
                        contractAddress: address,
                        cumulativeGasUsed: 10,
                        transactionIndex: 3,
                        blockNumber: 10,
                        blockHash: '0xbf1234',
                        gasUsed: 0
                    });
                    done();
                });
        });

        it('_executeMethod should sendTransaction and check for receipts', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = sha3('mySend(address,uint256)').slice(0, 10);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: `${signature}000000000000000000000000${addressLowercase.replace('0x', '')}000000000000000000000000000000000000000000000000000000000000000a`,
                    from: address2,
                    to: addressLowercase,
                    gasPrice: '0x5af3107a4000'
                }]);
            });
            provider.injectResult('0x1234000000000000000000000000000000000000000000000000000000056789');

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234000000000000000000000000000000000000000000000000000000056789']);
            });
            provider.injectResult(null);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult('0x1234567');

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
                assert.deepEqual(payload.params, ['0x1234000000000000000000000000000000000000000000000000000000056789']);
            });
            provider.injectResult({
                contractAddress: addressLowercase,
                cumulativeGasUsed: '0xa',
                transactionIndex: '0x3',
                blockNumber: '0xa',
                blockHash: '0xbf1234',
                gasUsed: '0x0'
            });
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_unsubscribe');
                assert.deepEqual(payload.params, ['0x1234567']);
            });
            provider.injectResult('0x321');

            const contract = new eth.Contract(abi, address);

            const txObject = {};
            txObject._method = {
                signature,
                name: 'send',
                type: 'function',
                inputs: [{
                    name: 'to',
                    type: 'address'
                }, {
                    name: 'value',
                    type: 'uint256'
                }],
                outputs: []
            };
            txObject._parent = contract;
            txObject.encodeABI = contract._encodeMethodABI.bind(txObject);
            txObject.arguments = [address, 10];

            contract._executeMethod.call(txObject, 'send', { from: address2, gasPrice: '100000000000000' }, (err, result) => {
                // tx hash
                assert.isNull(err);
                assert.equal(result, '0x1234000000000000000000000000000000000000000000000000000000056789');
            })
                .on('receipt', (result) => {
                    assert.deepEqual(result, {
                        contractAddress: address,
                        cumulativeGasUsed: 10,
                        transactionIndex: 3,
                        blockNumber: 10,
                        blockHash: '0xbf1234',
                        gasUsed: 0
                    });
                    done();
                });
        });

        it('_executeMethod should call and return values', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = sha3('balance(address)').slice(0, 10);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: `${signature}000000000000000000000000${addressLowercase.replace('0x', '')}`,
                    from: address2,
                    to: addressLowercase
                }, 'latest']);
            });
            provider.injectResult('0x000000000000000000000000000000000000000000000000000000000000000a');

            const contract = new eth.Contract(abi, address);

            const txObject = {};
            txObject._method = {
                signature,
                name: 'balance',
                type: 'function',
                inputs: [{
                    name: 'who',
                    type: 'address'
                }],
                constant: true,
                outputs: [{
                    name: 'value',
                    type: 'uint256'
                }]
            };
            txObject._parent = contract;
            txObject.encodeABI = contract._encodeMethodABI.bind(txObject);
            txObject.arguments = [address];

            contract._executeMethod.call(txObject, 'call', { from: address2 }, (err, result) => {
                assert.isNull(err);
                assert.equal(result, '10');
            })
                .then((result) => {
                    assert.equal(result, '10');
                    done();
                });
        });
    });

    describe('event', () => {
        it('should create event subscription', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'Changed(address,uint256,uint256,uint256)';
            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params[1], {
                    topics: [
                        sha3(signature),
                        (`0x000000000000000000000000${addressLowercase.replace('0x', '')}`),
                        null
                    ],
                    address: addressLowercase
                });
            });
            provider.injectResult('0x123');
            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_unsubscribe');
                done();
            });

            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x123',
                    result: {
                        address: addressLowercase,
                        topics: [
                            sha3(signature),
                            (`0x000000000000000000000000${addressLowercase.replace('0x', '')}`),
                            '0x0000000000000000000000000000000000000000000000000000000000000001'
                        ],
                        blockNumber: '0x3',
                        transactionHash: '0x1234',
                        blockHash: '0x1345',
                        logIndex: '0x4',
                        data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                        '0000000000000000000000000000000000000000000000000000000000000008'
                    }
                }
            });

            const contract = new eth.Contract(abi, address);

            contract.events.Changed({ filter: { from: address } }, (err, result, sub) => {
                assert.isNull(err);
                assert.equal(result.returnValues.from, address);
                assert.equal(result.returnValues.amount, 1);
                assert.equal(result.returnValues.t1, 1);
                assert.equal(result.returnValues.t2, 8);

                sub.unsubscribe();
            });
        });

        it('should create event from the events object and use the fromBlock option', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'Changed(address,uint256,uint256,uint256)';

            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_getLogs');
            });
            provider.injectResult([{
                address: addressLowercase,
                topics: [
                    sha3(signature),
                    `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                    '0x0000000000000000000000000000000000000000000000000000000000000002'
                ],
                blockNumber: '0x3',
                transactionHash: '0x1234',
                blockHash: '0x1345',
                logIndex: '0x4',
                data: '0x0000000000000000000000000000000000000000000000000000000000000002' +
                    '0000000000000000000000000000000000000000000000000000000000000009'
            },
            {
                address: addressLowercase,
                topics: [
                    sha3(signature),
                    `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                    '0x0000000000000000000000000000000000000000000000000000000000000003'
                ],
                blockNumber: '0x4',
                transactionHash: '0x1235',
                blockHash: '0x1346',
                logIndex: '0x1',
                data: '0x0000000000000000000000000000000000000000000000000000000000000004' +
                    '0000000000000000000000000000000000000000000000000000000000000005'
            }]);

            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params[1], {
                    topics: [
                        sha3(signature),
                        `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                        null
                    ],
                    address: addressLowercase
                });
            });
            provider.injectResult('0x321');

            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_unsubscribe');
                done();
            });
            provider.injectResult(true);

            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x321',
                    result: {
                        address: addressLowercase,
                        topics: [
                            sha3(signature),
                            `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                            '0x0000000000000000000000000000000000000000000000000000000000000001'
                        ],
                        blockNumber: '0x3',
                        transactionHash: '0x1234',
                        blockHash: '0x1345',
                        logIndex: '0x4',
                        data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                        '0000000000000000000000000000000000000000000000000000000000000008'
                    }
                }
            });

            const contract = new eth.Contract(abi, address);
            let count = 0;
            const event = contract.events.Changed({ fromBlock: 0, filter: { from: address } })
                .on('data', (result) => {
                    count++;

                    if (count === 1) {
                        assert.equal(result.returnValues.from, address);
                        assert.equal(result.returnValues.amount, 2);
                        assert.equal(result.returnValues.t1, 2);
                        assert.equal(result.returnValues.t2, 9);
                    }
                    if (count === 2) {
                        assert.equal(result.returnValues.from, address);
                        assert.equal(result.returnValues.amount, 3);
                        assert.equal(result.returnValues.t1, 4);
                        assert.equal(result.returnValues.t2, 5);
                    }
                    if (count === 3) {
                        assert.equal(result.returnValues.from, address);
                        assert.equal(result.returnValues.amount, 1);
                        assert.equal(result.returnValues.t1, 1);
                        assert.equal(result.returnValues.t2, 8);

                        event.unsubscribe();
                    }
                });
        });

        it('should create event from the events object using a signature and callback', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'Changed(address,uint256,uint256,uint256)';

            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params[1], {
                    topics: [
                        sha3(signature),
                        `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                        null
                    ],
                    address: addressLowercase
                });
            });
            provider.injectResult('0x321');

            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_unsubscribe');
                done();
            });
            provider.injectResult(true);

            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x321',
                    result: {
                        address: addressLowercase,
                        topics: [
                            sha3(signature),
                            `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                            '0x0000000000000000000000000000000000000000000000000000000000000001'
                        ],
                        blockNumber: '0x3',
                        transactionHash: '0x1234',
                        blockHash: '0x1345',
                        logIndex: '0x4',
                        data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                        '0000000000000000000000000000000000000000000000000000000000000008'
                    }
                }
            });

            const contract = new eth.Contract(abi, address);
            const event = contract.events['0x792991ed5ba9322deaef76cff5051ce4bedaaa4d097585970f9ad8f09f54e651']({ filter: { from: address } }, (err, result) => {
                assert.isNull(err);
                assert.equal(result.returnValues.from, address);
                assert.equal(result.returnValues.amount, 1);
                assert.equal(result.returnValues.t1, 1);
                assert.equal(result.returnValues.t2, 8);

                event.unsubscribe();
            });
        });

        it('should create event from the events object using event name and parameters', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'Changed(address,uint256,uint256,uint256)';

            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params[1], {
                    topics: [
                        sha3(signature),
                        `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                        null
                    ],
                    address: addressLowercase
                });
            });
            provider.injectResult('0x321');

            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_unsubscribe');
                done();
            });
            provider.injectResult(true);

            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x321',
                    result: {
                        address: addressLowercase,
                        topics: [
                            sha3(signature),
                            `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                            '0x0000000000000000000000000000000000000000000000000000000000000001'
                        ],
                        blockNumber: '0x3',
                        transactionHash: '0x1234',
                        blockHash: '0x1345',
                        logIndex: '0x4',
                        data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                        '0000000000000000000000000000000000000000000000000000000000000008'
                    }
                }
            });

            const contract = new eth.Contract(abi, address);
            const options = { filter: { from: address } };
            const event = contract.events[signature](options, (err, result) => {
                assert.isNull(err);
                assert.equal(result.returnValues.from, address);
                assert.equal(result.returnValues.amount, 1);
                assert.equal(result.returnValues.t1, 1);
                assert.equal(result.returnValues.t2, 8);

                event.unsubscribe();
            });
        });

        it('should create event using the  function and unsubscribe after one log received', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'Changed(address,uint256,uint256,uint256)';

            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params[1], {
                    topics: [
                        sha3(signature),
                        `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                        null
                    ],
                    address: addressLowercase
                });
            });
            provider.injectResult('0x321');

            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_unsubscribe');
            });
            provider.injectResult(true);

            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x321',
                    result: {
                        address: addressLowercase,
                        topics: [
                            sha3(signature),
                            `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                            '0x0000000000000000000000000000000000000000000000000000000000000001'
                        ],
                        blockNumber: '0x3',
                        transactionHash: '0x1234',
                        blockHash: '0x1345',
                        logIndex: '0x4',
                        data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                        '0000000000000000000000000000000000000000000000000000000000000008'
                    }
                }
            });

            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x321',
                    result: {
                        address: addressLowercase,
                        topics: [
                            sha3(signature),
                            `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                            '0x0000000000000000000000000000000000000000000000000000000000000001'
                        ],
                        blockNumber: '0x3',
                        transactionHash: '0x1234',
                        blockHash: '0x1345',
                        logIndex: '0x4',
                        data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                        '0000000000000000000000000000000000000000000000000000000000000008'
                    }
                }
            });

            let count = 1;
            const contract = new eth.Contract(abi, address);
            contract.once('Changed', { filter: { from: address } }, (err, result, sub) => {
                assert.isNull(err);
                assert.equal(result.returnValues.from, address);
                assert.equal(result.returnValues.amount, 1);
                assert.equal(result.returnValues.t1, 1);
                assert.equal(result.returnValues.t2, 8);
                assert.deepEqual(sub.options.requestManager.subscriptions, {});

                assert.equal(count, 1);
                count++;

                setTimeout(done, 10);
            });
        });

        it('should create event using the  function and unsubscribe after one log received when no options are provided', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'Changed(address,uint256,uint256,uint256)';

            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params[1], {
                    topics: [
                        sha3(signature),
                        null,
                        null
                    ],
                    address: addressLowercase
                });
            });
            provider.injectResult('0x321');

            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_unsubscribe');
            });
            provider.injectResult(true);

            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x321',
                    result: {
                        address: addressLowercase,
                        topics: [
                            sha3(signature),
                            `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                            '0x0000000000000000000000000000000000000000000000000000000000000001'
                        ],
                        blockNumber: '0x3',
                        transactionHash: '0x1234',
                        blockHash: '0x1345',
                        logIndex: '0x4',
                        data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                        '0000000000000000000000000000000000000000000000000000000000000008'
                    }
                }
            });

            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x321',
                    result: {
                        address: addressLowercase,
                        topics: [
                            sha3(signature),
                            `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                            '0x0000000000000000000000000000000000000000000000000000000000000001'
                        ],
                        blockNumber: '0x3',
                        transactionHash: '0x1234',
                        blockHash: '0x1345',
                        logIndex: '0x4',
                        data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                        '0000000000000000000000000000000000000000000000000000000000000008'
                    }
                }
            });

            let count = 1;
            const contract = new eth.Contract(abi, address);
            contract.once('Changed', (err, result, sub) => {
                assert.isNull(err);
                assert.equal(result.returnValues.from, address);
                assert.equal(result.returnValues.amount, 1);
                assert.equal(result.returnValues.t1, 1);
                assert.equal(result.returnValues.t2, 8);
                assert.deepEqual(sub.options.requestManager.subscriptions, {});

                assert.equal(count, 1);
                count++;

                setTimeout(done, 10);
            });
        });

        it('should throw an error when using the once() function and no callback is provided', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            const contract = new eth.Contract(abi, address);
            assert.throws(contract.once.bind(contract, 'Changed', { filter: { from: address } }));
        });

        it('should create event subscription and fire the changed event, if log.removed = true', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'Changed(address,uint256,uint256,uint256)';

            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params[1], {
                    topics: [
                        sha3(signature),
                        `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                        null
                    ],
                    address: addressLowercase
                });
            });
            provider.injectResult('0x321');

            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_unsubscribe');
            });
            provider.injectResult(true);

            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x321',
                    result: {
                        address: addressLowercase,
                        topics: [
                            sha3(signature),
                            `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                            '0x0000000000000000000000000000000000000000000000000000000000000001'
                        ],
                        blockNumber: '0x3',
                        transactionHash: '0x1234',
                        blockHash: '0x1345',
                        logIndex: '0x4',
                        data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                        '0000000000000000000000000000000000000000000000000000000000000008'
                    }
                }
            });

            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x321',
                    result: {
                        address: addressLowercase,
                        topics: [
                            sha3(signature),
                            `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                            '0x0000000000000000000000000000000000000000000000000000000000000001'
                        ],
                        blockNumber: '0x3',
                        removed: true,
                        transactionHash: '0x1234',
                        blockHash: '0x1345',
                        logIndex: '0x4',
                        data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                        '0000000000000000000000000000000000000000000000000000000000000008'
                    }
                }
            });

            let count = 1;
            const contract = new eth.Contract(abi, address);
            contract.events.Changed({ filter: { from: address } })
                .on('data', (result) => {
                    assert.equal(result.returnValues.from, address);
                    assert.equal(result.returnValues.amount, 1);
                    assert.equal(result.returnValues.t1, 1);
                    assert.equal(result.returnValues.t2, 8);

                    assert.equal(count, 1);
                    count++;
                })
                .on('changed', (result) => {
                    assert.equal(result.returnValues.from, address);
                    assert.equal(result.returnValues.amount, 1);
                    assert.equal(result.returnValues.t1, 1);
                    assert.equal(result.returnValues.t2, 8);
                    assert.equal(result.removed, true);

                    assert.equal(count, 2);
                });

            setTimeout(done, 60);
        });

        it('should create all event filter and receive two logs', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params[1], {
                    topics: [],
                    address: addressLowercase
                });
            });
            provider.injectResult('0x333');

            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_unsubscribe');
                done();
            });
            provider.injectResult(true);

            const contract = new eth.Contract(abi, address);

            let count = 0;
            const event = contract.events.allEvents((err, result) => {
                assert.isNull(err);

                count++;

                if (count === 1) {
                    assert.equal(result.returnValues.from, address);
                    assert.equal(result.returnValues.amount, 1);
                    assert.equal(result.returnValues.t1, 1);
                    assert.equal(result.returnValues.t2, 8);
                }
                if (count === 2) {
                    assert.equal(result.returnValues.addressFrom, address);
                    assert.equal(result.returnValues.value, 2);
                    assert.equal(result.returnValues.t1, 5);

                    event.unsubscribe();
                }
            });

            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x333',
                    result: {
                        address,
                        topics: [
                            sha3('Changed(address,uint256,uint256,uint256)'),
                            `0x000000000000000000000000${address.replace('0x', '')}`,
                            '0x0000000000000000000000000000000000000000000000000000000000000001'
                        ],
                        blockNumber: '0x3',
                        transactionHash: '0x1234',
                        blockHash: '0x1345',
                        logIndex: '0x4',
                        data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                        '0000000000000000000000000000000000000000000000000000000000000008'
                    }
                }
            });

            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x333',
                    result: {
                        address,
                        topics: [
                            sha3('Unchanged(uint256,address,uint256)'),
                            '0x0000000000000000000000000000000000000000000000000000000000000002',
                            `0x000000000000000000000000${address.replace('0x', '')}`
                        ],
                        blockNumber: '0x3',
                        transactionHash: '0x1234',
                        blockHash: '0x1345',
                        logIndex: '0x4',
                        data: '0x0000000000000000000000000000000000000000000000000000000000000005'
                    }
                }
            });
        });
    });
    describe('with methods', () => {
        it('should change the address', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'balance(address)';

            const contract = new eth.Contract(abi, address);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: `${sha3(signature).slice(0, 10)}000000000000000000000000${addressLowercase.replace('0x', '')}`,
                    to: addressLowercase,
                    from: address2
                }, 'latest']);
            });

            contract.methods.balance(address).call({ from: address2 });

            // change address
            contract.options.address = address2;

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: `${sha3(signature).slice(0, 10)}000000000000000000000000${addressLowercase.replace('0x', '')}`,
                    to: address2,
                    from: addressLowercase
                }, 'latest']);
            });

            contract.methods.balance(address).call({ from: address });
        });

        it('should reset functions when resetting json interface', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            const contract = new eth.Contract(abi);

            assert.isFunction(contract.methods.mySend);
            assert.isFunction(contract.events.Changed);

            contract.options.jsonInterface = [{
                name: 'otherSend',
                type: 'function',
                inputs: [{
                    name: 'to',
                    type: 'address'
                }, {
                    name: 'value',
                    type: 'uint256'
                }],
                outputs: []
            }, {
                name: 'Unchanged',
                type: 'event',
                inputs: [
                    { name: 'value', type: 'uint256', indexed: true },
                    { name: 'addressFrom', type: 'address', indexed: true },
                    { name: 't1', type: 'uint256', indexed: false }
                ]
            }];

            assert.isFunction(contract.methods.otherSend);
            assert.isFunction(contract.events.Unchanged);

            assert.isUndefined(contract.methods.mySend);
            assert.isUndefined(contract.events.Changed);
        });

        it('should encode a function call', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'balance(address)';

            const contract = new eth.Contract(abi);

            const result = contract.methods.balance(address).encodeABI();

            assert.equal(result, `${sha3(signature).slice(0, 10)}000000000000000000000000${addressLowercase.replace('0x', '')}`);
        });

        it('should encode a constructor call with pre set data', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            const contract = new eth.Contract(abi, { data: '0x1234' });

            const result = contract.deploy({
                arguments: [address, 10]
            }).encodeABI();

            assert.equal(result, `${'0x1234000000000000000000000000'}${addressLowercase.replace('0x', '')}000000000000000000000000000000000000000000000000000000000000000a`);
        });

        it('should encode a constructor call with passed data', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            const contract = new eth.Contract(abi);

            const result = contract.deploy({
                arguments: [address, 10],
                data: '0x1234'
            }).encodeABI();

            assert.equal(result, `${'0x1234000000000000000000000000'}${addressLowercase.replace('0x', '')}000000000000000000000000000000000000000000000000000000000000000a`);
        });

        it('should estimate a function', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'balance(address)';

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_estimateGas');
                assert.deepEqual(payload.params, [{
                    data: `${sha3(signature).slice(0, 10)}000000000000000000000000${addressLowercase.replace('0x', '')}`,
                    to: addressLowercase
                }]);
            });
            provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000032');

            const contract = new eth.Contract(abi, address);

            contract.methods.balance(address).estimateGas((err, res) => {
                assert.isNull(err);
                assert.deepEqual(res, 50);
                done();
            });
        });

        it('should estimate the constructor', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_estimateGas');
                assert.deepEqual(payload.params, [{
                    data: `0x1234000000000000000000000000${addressLowercase.replace('0x', '')}0000000000000000000000000000000000000000000000000000000000000032`
                }]);
            });
            provider.injectResult('0x000000000000000000000000000000000000000000000000000000000000000a');

            const contract = new eth.Contract(abi, address, { data: '0x1234' });

            contract.deploy({
                arguments: [address, 50]
            }).estimateGas((err, res) => {
                assert.isNull(err);
                assert.deepEqual(res, 10);
                done();
            });
        });

        it('should send with many parameters', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: '0x8708f4a12454534500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000c30786666323435343533343500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004ff24545345000000000000000000000000000000000000000000000000000000534500000000000000000000000000000000000000000000000000000000000045450000000000000000000000000000000000000000000000000000000000004533450000000000000000000000000000000000000000000000000000000000',
                    to: addressLowercase
                }, 'latest']);
            });
            provider.injectResult(`0x000000000000000000000000${addressLowercase.replace('0x', '')}`);

            const contract = new eth.Contract(abi, address);

            contract.methods.hasALotOfParams('0x24545345', '0xff24545345', ['0xff24545345', '0x5345', '0x4545', '0x453345']).call((err, res) => {
                assert.isNull(err);
                assert.deepEqual(res, address);
                done();
            });
        });

        it('should call constant function', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'balance(address)';

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: `${sha3(signature).slice(0, 10)}000000000000000000000000${addressLowercase.replace('0x', '')}`,
                    to: addressLowercase
                }, 'latest']);
            });
            provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000032');

            const contract = new eth.Contract(abi, address);

            contract.methods.balance(address).call((err, res) => {
                assert.isNull(err);
                assert.deepEqual(res, '50');
                done();
            });
        });

        it('should call constant function with default block', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'balance(address)';

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: `${sha3(signature).slice(0, 10)}000000000000000000000000${addressLowercase.replace('0x', '')}`,
                    to: addressLowercase
                }, '0xb']);
            });
            provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000032');

            const contract = new eth.Contract(abi, address);

            contract.methods.balance(address).call(11)
                .then((r) => {
                    assert.deepEqual(r, '50');
                    done();
                });
        });

        it('should call constant concurrently', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: `${sha3('balance(address)').slice(0, 10)}000000000000000000000000${addressLowercase.replace('0x', '')}`,
                    to: addressLowercase
                }, 'latest']);
            });
            provider.injectResult('0x000000000000000000000000000000000000000000000000000000000000000a');
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: sha3('owner()').slice(0, 10),
                    to: addressLowercase
                }, 'latest']);
            });
            provider.injectResult('0x00000000000000000000000011f4d0a3c12e86b4b5f39b213f7e19d048276dae');
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: sha3('getStr()').slice(0, 10),
                    to: addressLowercase
                }, 'latest']);
            });
            provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000');

            const contract = new eth.Contract(abi, address);

            Promise.join(
                contract.methods.balance(address).call(),
                contract.methods.owner().call(),
                contract.methods.getStr().call()
            ).spread((m1, m2, m3) => {
                assert.deepEqual(m1, '10');
                assert.deepEqual(m2, '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe');
                assert.deepEqual(m3, 'Hello!%!');

                done();
            });
        });

        it('should return an error when returned string is 0x', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'getStr()';

            const contract = new eth.Contract(abi, address);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(signature).slice(0, 10),
                    to: addressLowercase,
                    from: address2
                }, 'latest']);
            });

            provider.injectResult('0x');

            contract.methods.getStr().call({ from: address2 }, (err, result) => {
                assert.instanceOf(err, Error);
                assert.isUndefined(result);
                done();
            });
        });

        it('should return an empty string when 0x0', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'getStr()';

            const contract = new eth.Contract(abi, address);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(signature).slice(0, 10),
                    to: addressLowercase,
                    from: address2
                }, 'latest']);
            });

            provider.injectResult('0x0');

            contract.methods.getStr().call({ from: address2 }, (err, result) => {
                assert.isNull(err);
                assert.equal(result, '');
                done();
            });
        });

        it('should sendTransaction and check for receipts with formatted logs', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = sha3('mySend(address,uint256)').slice(0, 10);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: `${signature}000000000000000000000000${addressLowercase.replace('0x', '')}000000000000000000000000000000000000000000000000000000000000000a`,
                    from: address2,
                    to: addressLowercase,
                    gasPrice: '0x1369ed97fb71'
                }]);
            });
            provider.injectResult('0x1234000000000000000000000000000000000000000000000000000000056789');

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234000000000000000000000000000000000000000000000000000000056789']);
            });
            provider.injectResult(null);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult('0x1234567');

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
                assert.deepEqual(payload.params, ['0x1234000000000000000000000000000000000000000000000000000000056789']);
            });
            provider.injectResult({
                contractAddress: null,
                cumulativeGasUsed: '0xa',
                transactionIndex: '0x3',
                transactionHash: '0x1234',
                blockNumber: '0xa',
                blockHash: '0x1234',
                gasUsed: '0x0',
                logs: [{
                    address,
                    topics: [
                        sha3('Unchanged(uint256,address,uint256)'),
                        '0x0000000000000000000000000000000000000000000000000000000000000002',
                        `0x000000000000000000000000${addressLowercase.replace('0x', '')}`
                    ],
                    blockNumber: '0xa',
                    transactionHash: '0x1234',
                    transactionIndex: '0x0',
                    blockHash: '0x1345',
                    logIndex: '0x4',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000005'
                }, {
                    address,
                    topics: [
                        sha3('Changed(address,uint256,uint256,uint256)'),
                        `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                        '0x0000000000000000000000000000000000000000000000000000000000000001'
                    ],
                    blockNumber: '0xa',
                    transactionHash: '0x1234',
                    transactionIndex: '0x0',
                    blockHash: '0x1345',
                    logIndex: '0x4',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                    '0000000000000000000000000000000000000000000000000000000000000008'
                }]
            });
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_unsubscribe');
                assert.deepEqual(payload.params, ['0x1234567']);
            });
            provider.injectResult('0x321');

            const contract = new eth.Contract(abi, address);

            contract.methods.mySend(address, 10).send({ from: address2, gasPrice: '21345678654321' })
                .on('receipt', (receipt) => {
                // wont throw if it errors ?!
                    assert.deepEqual(receipt, {
                        contractAddress: null,
                        cumulativeGasUsed: 10,
                        transactionIndex: 3,
                        transactionHash: '0x1234',
                        blockNumber: 10,
                        blockHash: '0x1234',
                        gasUsed: 0,
                        events: {
                            Unchanged: {
                                address,
                                blockNumber: 10,
                                transactionHash: '0x1234',
                                blockHash: '0x1345',
                                logIndex: 4,
                                id: 'log_9ff24cb4',
                                transactionIndex: 0,
                                returnValues: {
                                    0: '2',
                                    1: address,
                                    2: '5',
                                    value: '2',
                                    addressFrom: address,
                                    t1: '5'
                                },
                                event: 'Unchanged',
                                signature: '0xf359668f205d0b5cfdc20d11353e05f633f83322e96f15486cbb007d210d66e5',
                                raw: {
                                    topics: ['0xf359668f205d0b5cfdc20d11353e05f633f83322e96f15486cbb007d210d66e5',
                                        '0x0000000000000000000000000000000000000000000000000000000000000002',
                                        `0x000000000000000000000000${addressLowercase.replace('0x', '')}`],
                                    data: '0x0000000000000000000000000000000000000000000000000000000000000005'
                                }
                            },
                            Changed: {
                                address: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                                blockNumber: 10,
                                transactionHash: '0x1234',
                                blockHash: '0x1345',
                                logIndex: 4,
                                id: 'log_9ff24cb4',
                                transactionIndex: 0,
                                returnValues: {
                                    0: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                                    1: '1',
                                    2: '1',
                                    3: '8',
                                    from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                                    amount: '1',
                                    t1: '1',
                                    t2: '8'
                                },
                                event: 'Changed',
                                signature: '0x792991ed5ba9322deaef76cff5051ce4bedaaa4d097585970f9ad8f09f54e651',
                                raw: {
                                    topics: ['0x792991ed5ba9322deaef76cff5051ce4bedaaa4d097585970f9ad8f09f54e651',
                                        `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                                        '0x0000000000000000000000000000000000000000000000000000000000000001'],
                                    data: '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000008'
                                }
                            }
                        }
                    });

                    done();
                });
        });

        it('should sendTransaction and check for receipts with formatted logs when multiple of same event', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = sha3('mySend(address,uint256)').slice(0, 10);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: `${signature}000000000000000000000000${addressLowercase.replace('0x', '')}000000000000000000000000000000000000000000000000000000000000000a`,
                    from: address2,
                    to: addressLowercase,
                    gasPrice: '0x1369ed97fb71'
                }]);
            });
            provider.injectResult('0x1234000000000000000000000000000000000000000000000000000000056789');

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234000000000000000000000000000000000000000000000000000000056789']);
            });
            provider.injectResult(null);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult('0x1234567');

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
                assert.deepEqual(payload.params, ['0x1234000000000000000000000000000000000000000000000000000000056789']);
            });
            provider.injectResult({
                contractAddress: null,
                cumulativeGasUsed: '0xa',
                transactionIndex: '0x3',
                transactionHash: '0x1234',
                blockNumber: '0xa',
                blockHash: '0x1234',
                gasUsed: '0x0',
                logs: [{
                    address,
                    topics: [
                        sha3('Changed(address,uint256,uint256,uint256)'),
                        `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                        '0x0000000000000000000000000000000000000000000000000000000000000001'
                    ],
                    blockNumber: '0xa',
                    transactionHash: '0x1234',
                    transactionIndex: '0x0',
                    blockHash: '0x1345',
                    logIndex: '0x4',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                    '0000000000000000000000000000000000000000000000000000000000000008'
                }, {
                    address,
                    topics: [
                        sha3('Changed(address,uint256,uint256,uint256)'),
                        `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                        '0x0000000000000000000000000000000000000000000000000000000000000002'
                    ],
                    blockNumber: '0xa',
                    transactionHash: '0x1234',
                    transactionIndex: '0x0',
                    blockHash: '0x1345',
                    logIndex: '0x5',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                    '0000000000000000000000000000000000000000000000000000000000000008'
                }]
            });
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_unsubscribe');
                assert.deepEqual(payload.params, ['0x1234567']);
            });
            provider.injectResult('0x321');

            const contract = new eth.Contract(abi, address);

            contract.methods.mySend(address, 10).send({ from: address2, gasPrice: '21345678654321' })
                .on('receipt', (receipt) => {
                    // wont throw if it errors ?! nope: causes a timeout
                    assert.deepEqual(receipt, {
                        contractAddress: null,
                        cumulativeGasUsed: 10,
                        transactionIndex: 3,
                        transactionHash: '0x1234',
                        blockNumber: 10,
                        blockHash: '0x1234',
                        gasUsed: 0,
                        events: {
                            Changed: [
                                {
                                    address: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                                    blockNumber: 10,
                                    transactionHash: '0x1234',
                                    blockHash: '0x1345',
                                    logIndex: 4,
                                    id: 'log_9ff24cb4',
                                    transactionIndex: 0,
                                    returnValues: {
                                        0: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                                        1: '1',
                                        2: '1',
                                        3: '8',
                                        from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                                        amount: '1',
                                        t1: '1',
                                        t2: '8'
                                    },
                                    event: 'Changed',
                                    signature: '0x792991ed5ba9322deaef76cff5051ce4bedaaa4d097585970f9ad8f09f54e651',
                                    raw: {
                                        topics: ['0x792991ed5ba9322deaef76cff5051ce4bedaaa4d097585970f9ad8f09f54e651',
                                            `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                                            '0x0000000000000000000000000000000000000000000000000000000000000001'],
                                        data: '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000008'
                                    }
                                }, {
                                    address: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                                    blockNumber: 10,
                                    transactionHash: '0x1234',
                                    blockHash: '0x1345',
                                    logIndex: 5,
                                    id: 'log_8b8a2b7f',
                                    transactionIndex: 0,
                                    returnValues: {
                                        0: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                                        1: '2',
                                        2: '1',
                                        3: '8',
                                        from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                                        amount: '2',
                                        t1: '1',
                                        t2: '8'
                                    },
                                    event: 'Changed',
                                    signature: '0x792991ed5ba9322deaef76cff5051ce4bedaaa4d097585970f9ad8f09f54e651',
                                    raw: {
                                        topics: ['0x792991ed5ba9322deaef76cff5051ce4bedaaa4d097585970f9ad8f09f54e651',
                                            `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                                            '0x0000000000000000000000000000000000000000000000000000000000000002'],
                                        data: '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000008'
                                    }
                                }
                            ]
                        }
                    });

                    done();
                });
        });

        it('should sendTransaction and check for receipts with formatted logs using the HTTP provider', (done) => {
            const provider = new FakeHttpProvider();
            const eth = new Eth(provider);
            const signature = sha3('mySend(address,uint256)').slice(0, 10);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: `${signature}000000000000000000000000${addressLowercase.replace('0x', '')}000000000000000000000000000000000000000000000000000000000000000a`,
                    from: address2,
                    to: addressLowercase,
                    gasPrice: '0x1369ed97fb71'
                }]);
            });
            provider.injectResult('0x1234000000000000000000000000000000000000000000000000000000056789');

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234000000000000000000000000000000000000000000000000000000056789']);
            });
            provider.injectResult(null);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234000000000000000000000000000000000000000000000000000000056789']);
            });
            provider.injectResult({
                contractAddress: null,
                cumulativeGasUsed: '0xa',
                transactionIndex: '0x3',
                transactionHash: '0x1234',
                blockNumber: '0xa',
                blockHash: '0x43ffdd',
                gasUsed: '0x0',
                logs: [{
                    address,
                    topics: [
                        sha3('Unchanged(uint256,address,uint256)'),
                        '0x0000000000000000000000000000000000000000000000000000000000000002',
                        `0x000000000000000000000000${addressLowercase.replace('0x', '')}`
                    ],
                    blockNumber: '0xa',
                    transactionHash: '0x1234',
                    transactionIndex: '0x0',
                    blockHash: '0x1345',
                    logIndex: '0x4',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000005'
                }, {
                    address,
                    topics: [
                        sha3('Changed(address,uint256,uint256,uint256)'),
                        `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                        '0x0000000000000000000000000000000000000000000000000000000000000001'
                    ],
                    blockNumber: '0xa',
                    transactionHash: '0x1234',
                    transactionIndex: '0x0',
                    blockHash: '0x1345',
                    logIndex: '0x4',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                    '0000000000000000000000000000000000000000000000000000000000000008'
                }]
            });
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_unsubscribe');
                assert.deepEqual(payload.params, ['0x1234567']);
            });
            provider.injectResult('0x321');

            const contract = new eth.Contract(abi, address);

            contract.methods.mySend(address, 10).send({ from: address2, gasPrice: '21345678654321' })
                .on('receipt', (receipt) => {
                    // wont throw if it errors ?!
                    assert.deepEqual(receipt, {
                        contractAddress: null,
                        cumulativeGasUsed: 10,
                        transactionIndex: 3,
                        transactionHash: '0x1234',
                        blockNumber: 10,
                        blockHash: '0x43ffdd',
                        gasUsed: 0,
                        events: {
                            Unchanged: {
                                address,
                                blockNumber: 10,
                                transactionHash: '0x1234',
                                blockHash: '0x1345',
                                logIndex: 4,
                                id: 'log_9ff24cb4',
                                transactionIndex: 0,
                                returnValues: {
                                    0: '2',
                                    1: address,
                                    2: '5',
                                    value: '2',
                                    addressFrom: address,
                                    t1: '5'
                                },
                                event: 'Unchanged',
                                signature: '0xf359668f205d0b5cfdc20d11353e05f633f83322e96f15486cbb007d210d66e5',
                                raw: {
                                    topics: ['0xf359668f205d0b5cfdc20d11353e05f633f83322e96f15486cbb007d210d66e5',
                                        '0x0000000000000000000000000000000000000000000000000000000000000002',
                                        `0x000000000000000000000000${addressLowercase.replace('0x', '')}`],
                                    data: '0x0000000000000000000000000000000000000000000000000000000000000005'
                                }
                            },
                            Changed: {
                                address: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                                blockNumber: 10,
                                transactionHash: '0x1234',
                                blockHash: '0x1345',
                                logIndex: 4,
                                id: 'log_9ff24cb4',
                                transactionIndex: 0,
                                returnValues: {
                                    0: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                                    1: '1',
                                    2: '1',
                                    3: '8',
                                    from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                                    amount: '1',
                                    t1: '1',
                                    t2: '8'
                                },
                                event: 'Changed',
                                signature: '0x792991ed5ba9322deaef76cff5051ce4bedaaa4d097585970f9ad8f09f54e651',
                                raw: {
                                    topics: ['0x792991ed5ba9322deaef76cff5051ce4bedaaa4d097585970f9ad8f09f54e651',
                                        `0x000000000000000000000000${addressLowercase.replace('0x', '')}`,
                                        '0x0000000000000000000000000000000000000000000000000000000000000001'],
                                    data: '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000008'
                                }
                            }
                        }
                    });

                    done();
                });
        });

        it('should sendTransaction to contract function', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'mySend(address,uint256)';

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: `${sha3(signature).slice(0, 10)
                    }000000000000000000000000${addressLowercase.replace('0x', '')
                    }0000000000000000000000000000000000000000000000000000000000000011`,
                    from: addressLowercase,
                    to: addressLowercase,
                    gasPrice: '0x369d1f7fd2'
                }]);
            });

            const contract = new eth.Contract(abi, address);

            contract.methods.mySend(address, 17).send({ from: address, gasPrice: '234564321234' });
        });

        it('should throw error when trying to send ether to a non payable contract function', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            const contract = new eth.Contract(abi, address);

            try {
                contract.methods.myDisallowedSend(address, 17).send({ from: address, value: 123 })
                    .on('error', (e) => {
                        assert.isTrue(e instanceof Error, 'Should throw error');
                    })
                    .catch((e) => {
                        assert.isTrue(e instanceof Error, 'Should throw error');
                    });
            } catch (e) {
                assert.isTrue(e instanceof Error, 'Should throw error');
            }
        });

        it('should not throw error when trying to not send ether to a non payable contract function', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'myDisallowedSend(address,uint256)';

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: `${sha3(signature).slice(0, 10)
                    }000000000000000000000000${addressLowercase.replace('0x', '')
                    }0000000000000000000000000000000000000000000000000000000000000011`,
                    from: addressLowercase,
                    to: addressLowercase,
                    gasPrice: '0x1555757ee6b1'
                }]);

                done();
            });

            const contract = new eth.Contract(abi, address);

            try {
                contract.methods.myDisallowedSend(address, 17).send({ from: address, gasPrice: '23456787654321' })
                    .on('error', (e) => {
                        assert.isFalse(e instanceof Error, 'Should not throw error');
                    })
                    .catch((e) => {
                        assert.isFalse(e instanceof Error, 'Should not throw error');
                    });
            } catch (e) {
                assert.isFalse(e instanceof Error, 'Should not throw error');
            }
        });

        it('should sendTransaction to contract function using the function namen incl. parameters', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = sha3('mySend(address,uint256)').slice(0, 10);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: `${signature
                    }000000000000000000000000${addressLowercase.replace('0x', '')
                    }0000000000000000000000000000000000000000000000000000000000000011`,
                    from: addressLowercase,
                    to: addressLowercase,
                    gasPrice: '0x1555757ee6b1'
                }]);
            });

            const contract = new eth.Contract(abi, address);

            contract.methods['mySend(address,uint256)'](address, 17).send({ from: address, gasPrice: '23456787654321' });
        });

        it('should sendTransaction to contract function using the signature', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = sha3('mySend(address,uint256)').slice(0, 10);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: `${signature
                    }000000000000000000000000${addressLowercase.replace('0x', '')
                    }0000000000000000000000000000000000000000000000000000000000000011`,
                    from: addressLowercase,
                    to: addressLowercase,
                    gasPrice: '0x49504f80'
                }]);
            });

            const contract = new eth.Contract(abi, address);

            contract.methods[signature](address, 17).send({ from: address, gasPrice: '1230000000' });
        });

        it('should throw when trying to create a tx object and wrong amount of params', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'mySend(address,uint256)';

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: `${sha3(signature).slice(0, 10)
                    }000000000000000000000000${addressLowercase.replace('0x', '')
                    }0000000000000000000000000000000000000000000000000000000000000011`,
                    to: addressLowercase,
                    from: addressLowercase,
                    gas: '0xc350',
                    gasPrice: '0xbb8',
                    value: '0x2710'
                }]);

                done();
            });

            const contract = new eth.Contract(abi, address);

            assert.throws(() => {
                contract.methods.mySend(address);
            });

            setTimeout(done, 1);
        });

        it('should make a call with optional params', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'balance(address)';
            let count = 0;

            provider.injectValidation((payload) => {
                count++;
                if (count > 1) {
                    return;
                }

                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: `${sha3(signature).slice(0, 10)}000000000000000000000000${addressLowercase.replace('0x', '')}`,
                    to: addressLowercase,
                    from: addressLowercase,
                    gas: '0xc350'
                }, 'latest']);
            });
            provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000032');

            const contract = new eth.Contract(abi, address);

            contract.methods.balance(address).call({ from: address, gas: 50000 })
                .then((r) => {
                    assert.deepEqual(r, '50');
                    done();
                });
        });

        it('should explicitly make a call with optional params', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'balance(address)';

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: `${sha3(signature).slice(0, 10)}000000000000000000000000${addressLowercase.replace('0x', '')}`,
                    to: addressLowercase,
                    from: addressLowercase,
                    gas: '0xc350'
                }, 'latest']);
            });
            provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000032');

            const contract = new eth.Contract(abi, address);

            contract.methods.balance(address).call({ from: address, gas: 50000 })
                .then((r) => {
                    assert.deepEqual(r, '50');
                    done();
                });
        });

        it('should explicitly make a call with optional params and defaultBlock', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'balance(address)';

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: `${sha3(signature).slice(0, 10)}000000000000000000000000${addressLowercase.replace('0x', '')}`,
                    to: addressLowercase,
                    from: addressLowercase,
                    gas: '0xc350'
                }, '0xb']);
            });
            provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000032');

            const contract = new eth.Contract(abi, address);

            contract.methods.balance(address).call({ from: address, gas: 50000 }, 11)
                .then((r) => {
                    assert.deepEqual(r, '50');
                    done();
                });
        });

        it('should sendTransaction with optional params', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'mySend(address,uint256)';

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: `${sha3(signature).slice(0, 10)
                    }000000000000000000000000${addressLowercase.replace('0x', '')
                    }0000000000000000000000000000000000000000000000000000000000000011`,
                    to: addressLowercase,
                    from: addressLowercase,
                    gas: '0xc350',
                    gasPrice: '0xbb8',
                    value: '0x2710'
                }]);

                done();
            });

            const contract = new eth.Contract(abi, address);

            contract.methods.mySend(address, 17).send({
                from: address, gas: 50000, gasPrice: 3000, value: 10000
            });
        });

        it('should sendTransaction and fill in default gasPrice', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'mySend(address,uint256)';

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_gasPrice');
                assert.deepEqual(payload.params, []);
            });

            provider.injectResult('0x45656456456456');

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: `${sha3(signature).slice(0, 10)
                    }000000000000000000000000${addressLowercase.replace('0x', '')
                    }0000000000000000000000000000000000000000000000000000000000000011`,
                    to: addressLowercase,
                    from: addressLowercase,
                    gasPrice: '0x45656456456456'
                }]);

                done();
            });

            const contract = new eth.Contract(abi, address);

            contract.methods.mySend(address, 17).send({ from: address });
        });

        it('should explicitly sendTransaction with optional params', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'mySend(address,uint256)';

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: `${sha3(signature).slice(0, 10)
                    }000000000000000000000000${addressLowercase.replace('0x', '')
                    }0000000000000000000000000000000000000000000000000000000000000011`,
                    to: addressLowercase,
                    from: addressLowercase,
                    gas: '0xc350',
                    gasPrice: '0xbb8',
                    value: '0x2710'
                }]);

                done();
            });

            const contract = new eth.Contract(abi, address);

            contract.methods.mySend(address, 17).send({
                from: address, gas: 50000, gasPrice: 3000, value: 10000
            });
        });

        it('should explicitly call sendTransaction with optional params and call callback without error', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'mySend(address,uint256)';

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: `${sha3(signature).slice(0, 10)
                    }000000000000000000000000${addressLowercase.replace('0x', '')
                    }0000000000000000000000000000000000000000000000000000000000000011`,
                    to: addressLowercase,
                    from: addressLowercase,
                    gas: '0xc350',
                    gasPrice: '0xbb8',
                    value: '0x2710'
                }]);
            });

            const contract = new eth.Contract(abi, address);

            contract.methods.mySend(address, 17).send({
                from: address, gas: 50000, gasPrice: 3000, value: 10000
            }, (err) => {
                assert.equal(err, null);
                done();
            });
        });

        it('should explicitly estimateGas with optional params', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'mySend(address,uint256)';

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_estimateGas');
                assert.deepEqual(payload.params, [{
                    data: `${sha3(signature).slice(0, 10)
                    }000000000000000000000000${addressLowercase.replace('0x', '')
                    }0000000000000000000000000000000000000000000000000000000000000011`,
                    to: addressLowercase,
                    from: addressLowercase,
                    gas: '0xc350',
                    gasPrice: '0xbb8',
                    value: '0x2710'
                }]);
            });

            const contract = new eth.Contract(abi, address);

            contract.methods.mySend(address, 17).estimateGas({
                from: address, gas: 50000, gasPrice: 3000, value: 10000
            });
        });

        it('getPastEvents should get past events and format them correctly', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'testArr(int[])';

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getLogs');
                assert.deepEqual(payload.params, [{
                    address: addressLowercase,
                    topics: [
                        '0x792991ed5ba9322deaef76cff5051ce4bedaaa4d097585970f9ad8f09f54e651',
                        `0x000000000000000000000000${address2.replace('0x', '')}`,
                        null
                    ]
                }]);
            });

            const topic1 = [
                sha3(signature),
                `0x000000000000000000000000${address.replace('0x', '')}`,
                '0x000000000000000000000000000000000000000000000000000000000000000a'
            ];
            const topic2 = [
                sha3(signature),
                `0x000000000000000000000000${address.replace('0x', '')}`,
                '0x0000000000000000000000000000000000000000000000000000000000000003'
            ];

            provider.injectResult([{
                address,
                topics: topic1,
                blockNumber: '0x3',
                transactionHash: '0x1234',
                transactionIndex: '0x0',
                blockHash: '0x1345',
                logIndex: '0x4',
                data: '0x0000000000000000000000000000000000000000000000000000000000000002' +
                '0000000000000000000000000000000000000000000000000000000000000009'
            },
            {
                address,
                topics: topic2,
                blockNumber: '0x4',
                transactionHash: '0x1235',
                transactionIndex: '0x0',
                blockHash: '0x1346',
                logIndex: '0x1',
                data: '0x0000000000000000000000000000000000000000000000000000000000000004' +
                '0000000000000000000000000000000000000000000000000000000000000005'
            }]);

            const contract = new eth.Contract(abi, address);
            contract.getPastEvents('Changed', { filter: { from: address2 } })
                .then((result) => {
                    assert.deepEqual(result, [{
                        event: 'Changed',
                        signature: '0xc00c1c37cc8b83163fb4fddc06c74d1d5c00d74648e7cb28c0ebada3e32fd62c',
                        id: 'log_9ff24cb4',
                        address,
                        blockNumber: 3,
                        transactionHash: '0x1234',
                        blockHash: '0x1345',
                        logIndex: 4,
                        transactionIndex: 0,
                        raw: {
                            data: '0x0000000000000000000000000000000000000000000000000000000000000002' +
                        '0000000000000000000000000000000000000000000000000000000000000009',
                            topics: topic1
                        },
                        returnValues: {
                            0: address,
                            1: '10',
                            2: '2',
                            3: '9',
                            from: address,
                            amount: '10',
                            t1: '2',
                            t2: '9'
                        }
                    },
                    {
                        event: 'Changed',
                        signature: '0xc00c1c37cc8b83163fb4fddc06c74d1d5c00d74648e7cb28c0ebada3e32fd62c',
                        id: 'log_29c93e15',
                        address,
                        blockNumber: 4,
                        transactionHash: '0x1235',
                        blockHash: '0x1346',
                        logIndex: 1,
                        transactionIndex: 0,
                        raw: {
                            data: '0x0000000000000000000000000000000000000000000000000000000000000004' +
                            '0000000000000000000000000000000000000000000000000000000000000005',
                            topics: topic2
                        },
                        returnValues: {
                            0: address,
                            1: '3',
                            2: '4',
                            3: '5',
                            from: address,
                            amount: '3',
                            t1: '4',
                            t2: '5'
                        }
                    }]);

                    done();
                }).catch(done);
        });

        it('should call testArr method and properly parse result', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'testArr(int[])';

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: `${sha3(signature).slice(0, 10)
                    }0000000000000000000000000000000000000000000000000000000000000020` +
                        `0000000000000000000000000000000000000000000000000000000000000001` +
                        `0000000000000000000000000000000000000000000000000000000000000003`,
                    to: addressLowercase
                },
                'latest'
                ]);
            });

            provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000005');

            const contract = new eth.Contract(abi, address);
            contract.methods.testArr([3]).call()
                .then((result) => {
                    assert.deepEqual(result, '5');
                    done();
                });
        });

        it('should call testArr method, properly parse result and return the result in a callback', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'testArr(int[])';

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: `${sha3(signature).slice(0, 10)
                    }0000000000000000000000000000000000000000000000000000000000000020` +
                        `0000000000000000000000000000000000000000000000000000000000000001` +
                        `0000000000000000000000000000000000000000000000000000000000000003`,
                    to: addressLowercase
                },
                'latest'
                ]);
            });
            provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000005');

            const contract = new eth.Contract(abi, address);

            contract.methods.testArr([3]).call((err, result) => {
                assert.isNull(err);
                assert.deepEqual(result, '5');
                done();
            });
        });

        it('should call owner method, properly', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);
            const signature = 'owner()';

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(signature).slice(0, 10),
                    to: addressLowercase
                },
                'latest'
                ]);
            });
            provider.injectResult(addressLowercase);

            const contract = new eth.Contract(abi, address);

            contract.methods.owner().call((err, result) => {
                assert.isNull(err);
                assert.deepEqual(result, address);
                done();
            });
        });
    });
    describe('with data', () => {
        it('should deploy a contract and use callback', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            provider.injectResult('0x1234567');

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: '0x1234567000000000000000000000000555456789012345678901234567890123456789100000000000000000000000000000000000000000000000000000000000000c8',
                    from: addressLowercase,
                    gas: '0xc350',
                    gasPrice: '0xbb8'
                }]);
            });

            const contract = new eth.Contract(abi);

            contract.deploy({
                data: '0x1234567',
                arguments: ['0x5554567890123456789012345678901234567891', 200]
            }).send({
                from: address,
                gas: 50000,
                gasPrice: 3000
            }, (err, result) => {
                assert.equal(err, null);
                assert.equal(result, '0x1234567');
                done();
            });
        });

        it('should deploy a contract and use all promise steps', (done) => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: `0x1234567000000000000000000000000${addressLowercase.replace('0x', '')}00000000000000000000000000000000000000000000000000000000000000c8`,
                    from: addressLowercase,
                    gas: '0xc350',
                    gasPrice: '0xbb8'
                }]);
            });
            provider.injectResult('0x5550000000000000000000000000000000000000000000000000000000000032');

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x5550000000000000000000000000000000000000000000000000000000000032']);
            });
            provider.injectResult(null);

            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult('0x1234567');

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
                assert.deepEqual(payload.params, ['0x5550000000000000000000000000000000000000000000000000000000000032']);
            });
            provider.injectResult({
                contractAddress: addressLowercase,
                blockHash: '0xffdd'
            });
            provider.injectValidation((payload) => {
                assert.equal(payload.method, 'eth_getCode');
                assert.deepEqual(payload.params, [addressLowercase, 'latest']);
            });
            provider.injectResult('0x321');

            const contract = new eth.Contract(abi);

            contract.deploy({
                data: '0x1234567',
                arguments: [address, 200]
            }).send({
                from: address,
                gas: 50000,
                gasPrice: 3000
            })
                .on('transactionHash', (value) => {
                    assert.equal('0x5550000000000000000000000000000000000000000000000000000000000032', value);
                })
                .on('receipt', (receipt) => {
                    assert.equal(address, receipt.contractAddress);
                    assert.isNull(contract.options.address);
                })
                .then((newContract) => {
                    assert.equal(newContract.options.address, address);
                    assert.isTrue(newContract !== contract, 'contract objects shouldn\'t the same');

                    setTimeout(() => {
                        done();
                    }, 1);
                });
        });

        // TODO add error check
    });
});
