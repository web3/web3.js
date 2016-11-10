var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../index');
var FakeHttpProvider = require('./helpers/FakeHttpProvider');
var utils = require('../lib/utils/utils');
var BigNumber = require('bignumber.js');
var sha3 = require('../lib/utils/sha3');


var abi = [{
    "type": "constructor",
    "inputs": [{
        "name": "who",
        "type": "address"
    },{
        "name": "myValue",
        "type": "uint256"
    }]
},{
    "name": "balance",
    "type": "function",
    "inputs": [{
        "name": "who",
        "type": "address"
    }],
    "constant": true,
    "outputs": [{
        "name": "value",
        "type": "uint256"
    }]
}, {
    "name": "mySend",
    "type": "function",
    "inputs": [{
        "name": "to",
        "type": "address"
    }, {
        "name": "value",
        "type": "uint256"
    }],
    "outputs": []
}, {
    "name": "testArr",
    "type": "function",
    "inputs": [{
        "name": "value",
        "type": "int[]"
    }],
    "constant": true,
    "outputs": [{
        "name": "d",
        "type": "int"
    }]
}, {
    "name":"Changed",
    "type":"event",
    "inputs": [
        {"name":"from","type":"address","indexed":true},
        {"name":"amount","type":"uint256","indexed":true},
        {"name":"t1","type":"uint256","indexed":false},
        {"name":"t2","type":"uint256","indexed":false}
    ]
}, {
        "name":"Unchanged",
        "type":"event",
        "inputs": [
            {"name":"value","type":"uint256","indexed":true},
            {"name":"addressFrom","type":"address","indexed":true},
            {"name":"t1","type":"uint256","indexed":false}
        ]
    }];

var address = '0x1234567890123456789012345678901234567891';
var address2 = '0x5555567890123456789012345678901234567891';

describe('contract', function () {
    describe('internal method', function () {
        it('_encodeEventABI should return the encoded event object without topics', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);

            var contract = new web3.eth.contract(abi, address);

            var result = contract._encodeEventABI({
                signature: '0x1234',
                "name":"Changed",
                "type":"event",
                "inputs": [
                    {"name":"from","type":"address","indexed":true},
                    {"name":"amount","type":"uint256","indexed":true},
                    {"name":"t1","type":"uint256","indexed":false},
                    {"name":"t2","type":"uint256","indexed":false}
                ]
            });

            assert.deepEqual(result, {
                address: address,
                topics: [
                    '0x1234',
                    null,
                    null
                ]
            });

            done();
        });
        it('_encodeEventABI should return the encoded event object with topics', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);

            var contract = new web3.eth.contract(abi, address);

            var result = contract._encodeEventABI({
                signature: '0x1234',
                "name":"Changed",
                "type":"event",
                "inputs": [
                    {"name":"from","type":"address","indexed":true},
                    {"name":"amount","type":"uint256","indexed":true},
                    {"name":"t1","type":"uint256","indexed":false},
                    {"name":"t2","type":"uint256","indexed":false}
                ]
            }, {filter: {amount: 12}, fromBlock: 2});

            assert.deepEqual(result, {
                address: address,
                fromBlock: '0x2',
                topics: [
                    '0x1234',
                    null,
                    '0x000000000000000000000000000000000000000000000000000000000000000c'
                ]
            });

            done();
        });
        it('_decodeEventABI should return the decoded event object with topics', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'Changed(address,uint256,uint256,uint256)';

            var contract = new web3.eth.contract(abi, address);

            var result = contract._decodeEventABI.call({
                signature: '0x'+ sha3(signature),
                "name":"Changed",
                "type":"event",
                "inputs": [
                    {"name":"from","type":"address","indexed":true},
                    {"name":"amount","type":"uint256","indexed":true},
                    {"name":"t1","type":"uint256","indexed":false},
                    {"name":"t2","type":"uint256","indexed":false}
                ]
            }, {
                address: address,
                topics: [
                    '0x' + sha3(signature),
                    '0x000000000000000000000000'+ address.replace('0x',''),
                    '0x0000000000000000000000000000000000000000000000000000000000000001'
                ],
                blockNumber: '0x3',
                transactionHash: '0x1234',
                blockHash: '0x1345',
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

            done();
        });
        it('_decodeMethodReturn should return the decoded values', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'Changed(address,uint256,uint256,uint256)';

            var contract = new web3.eth.contract(abi, address);

            var result = contract._decodeMethodReturn([{
                "name": "myAddress",
                "type": "address"
            },{
                "name": "value",
                "type": "uint256"
            }], '0x000000000000000000000000'+ address.replace('0x','')+
                '000000000000000000000000000000000000000000000000000000000000000a');

            assert.equal(result[0], address);
            assert.equal(result[1], 10);

            done();
        });
        it('_checkForContractAddress should subscribe and check for receipts and code', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newBlocks', {}]);
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

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234000000000000000000000000000000000000000000000000000000056789']);
            });
            provider.injectResult({
                contractAddress: address,
                cumulativeGasUsed: '0xa',
                transactionIndex: '0x3',
                blockNumber: '0xa'
            });
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getCode');
                assert.deepEqual(payload.params, [address, 'latest']);
            });
            provider.injectResult('0x321');


            var contract = new web3.eth.contract(abi, address);

            var deploy = contract._checkForContractAddress('0x1234000000000000000000000000000000000000000000000000000000056789', function (err, result) {

                assert.equal(result.contractAddress, address);
                assert.equal(result.blockNumber, 10);
                assert.equal(result.transactionIndex, 3);
                assert.equal(result.cumulativeGasUsed, 10);

                done();
            });


        });
        it('_executeMethod should sendTransaction and check for receipts', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = sha3('mySend(address,uint256)').slice(0, 8);

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: "0x"+ signature +"0000000000000000000000001234567890123456789012345678901234567891000000000000000000000000000000000000000000000000000000000000000a",
                    from: address2,
                    to: address
                }]);
            });
            provider.injectResult('0x1234000000000000000000000000000000000000000000000000000000056789');

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newBlocks', {}]);
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

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234000000000000000000000000000000000000000000000000000000056789']);
            });
            provider.injectResult({
                contractAddress: address,
                cumulativeGasUsed: '0xa',
                transactionIndex: '0x3',
                blockNumber: '0xa'
            });
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_unsubscribe');
                assert.deepEqual(payload.params, ['0x1234567']);
            });
            provider.injectResult('0x321');


            var contract = new web3.eth.contract(abi, address);

            var txObject = {};
            txObject._method = {
                signature: signature,
                "name": "send",
                "type": "function",
                "inputs": [{
                    "name": "to",
                    "type": "address"
                }, {
                    "name": "value",
                    "type": "uint256"
                }],
                "outputs": []
            };
            txObject._parent = contract;
            txObject.encodeABI = contract._encodeMethodABI.bind(txObject);
            txObject.arguments = [address, 10];

            var deploy = contract._executeMethod.call(txObject, 'send', {from: address2}, function (err, result) {
                // tx hash
                assert.equal(result, '0x1234000000000000000000000000000000000000000000000000000000056789');
            })
            .on('receipt', function(result){
                assert.deepEqual(result, {
                    contractAddress: address,
                    cumulativeGasUsed: 10,
                    transactionIndex: 3,
                    blockNumber: 10,
                    gasUsed: 0
                });
                done();
            });

        });
        it('_executeMethod should call and return values', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = sha3('balance(address)').slice(0, 8);

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: "0x"+ signature +"0000000000000000000000001234567890123456789012345678901234567891",
                    from: address2,
                    to: address
                }, 'latest']);
            });
            provider.injectResult('0x000000000000000000000000000000000000000000000000000000000000000a');


            var contract = new web3.eth.contract(abi, address);

            var txObject = {};
            txObject._method = {
                signature: signature,
                "name": "balance",
                "type": "function",
                "inputs": [{
                    "name": "who",
                    "type": "address"
                }],
                "constant": true,
                "outputs": [{
                    "name": "value",
                    "type": "uint256"
                }]
            };
            txObject._parent = contract;
            txObject.encodeABI = contract._encodeMethodABI.bind(txObject);
            txObject.arguments = [address];

            var deploy = contract._executeMethod.call(txObject, 'call', {from: address2}, function (err, result) {
                assert.deepEqual(result, new BigNumber(0xa));
            })
            .on('data', function(result){
                assert.deepEqual(result, new BigNumber(0xa));
                done();
            });

        });
    });

    describe('event', function () {
        it('should create event subscription', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'Changed(address,uint256,uint256,uint256)';
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params[1], {
                    topics: [
                        '0x' + sha3(signature),
                        ('0x000000000000000000000000' + address.replace('0x', '')),
                        null
                    ],
                    address: address
                });
            });
            provider.injectResult('0x123');
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_unsubscribe');
                done();

            });

            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x123',
                    result: {
                        address: address,
                        topics: [
                            '0x' + sha3(signature),
                            ('0x000000000000000000000000' + address.replace('0x', '')),
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

            var contract = new web3.eth.contract(abi, address);

            var event = contract.events.Changed({filter: {from: address}}, function (err, result, sub) {
                assert.equal(result.returnValues.from, address);
                assert.equal(result.returnValues.amount, 1);
                assert.equal(result.returnValues.t1, 1);
                assert.equal(result.returnValues.t2, 8);

                sub.unsubscribe();
            });

        });

        it('should create event from the events object and use the fromBlock option', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'Changed(address,uint256,uint256,uint256)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_getLogs');
            });
            provider.injectResult([{
                    address: address,
                    topics: [
                        '0x' + sha3(signature),
                        '0x000000000000000000000000'+ address.replace('0x',''),
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
                    address: address,
                    topics: [
                        '0x' + sha3(signature),
                        '0x000000000000000000000000'+ address.replace('0x',''),
                        '0x0000000000000000000000000000000000000000000000000000000000000003'
                    ],
                    blockNumber: '0x4',
                    transactionHash: '0x1235',
                    blockHash: '0x1346',
                    logIndex: '0x1',
                    data: '0x0000000000000000000000000000000000000000000000000000000000000004' +
                    '0000000000000000000000000000000000000000000000000000000000000005'
            }]);

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params[1], {
                    topics: [
                        '0x' + sha3(signature),
                        '0x000000000000000000000000'+ address.replace('0x',''),
                        null
                    ],
                    address: address
                });
            });
            provider.injectResult('0x321');

            provider.injectValidation(function (payload) {
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
                        address: address,
                        topics: [
                            '0x' + sha3(signature),
                            '0x000000000000000000000000'+ address.replace('0x',''),
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

            var contract = new web3.eth.contract(abi, address);
            var count = 0;
            var event = contract.events.Changed({fromBlock: 0,filter: {from: address}})
                .on('data', function (result) {
                    count++;

                    if(count === 1) {
                        assert.equal(result.returnValues.from, address);
                        assert.equal(result.returnValues.amount, 2);
                        assert.equal(result.returnValues.t1, 2);
                        assert.equal(result.returnValues.t2, 9);

                    }
                    if(count === 2) {
                        assert.equal(result.returnValues.from, address);
                        assert.equal(result.returnValues.amount, 3);
                        assert.equal(result.returnValues.t1, 4);
                        assert.equal(result.returnValues.t2, 5);

                    }
                    if(count === 3) {
                        assert.equal(result.returnValues.from, address);
                        assert.equal(result.returnValues.amount, 1);
                        assert.equal(result.returnValues.t1, 1);
                        assert.equal(result.returnValues.t2, 8);

                        event.unsubscribe();
                    }

                });
        });


        it('should create event from the events object using a signature and callback', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'Changed(address,uint256,uint256,uint256)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params[1], {
                    topics: [
                        '0x' + sha3(signature),
                        '0x000000000000000000000000'+ address.replace('0x',''),
                        null
                    ],
                    address: address
                });
            });
            provider.injectResult('0x321');

            provider.injectValidation(function (payload) {
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
                        address: address,
                        topics: [
                            '0x' + sha3(signature),
                            '0x000000000000000000000000'+ address.replace('0x',''),
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

            var contract = new web3.eth.contract(abi, address);
            var event = contract.events['0x792991ed5ba9322deaef76cff5051ce4bedaaa4d097585970f9ad8f09f54e651']({filter: {from: address}}, function (err, result) {
                assert.equal(result.returnValues.from, address);
                assert.equal(result.returnValues.amount, 1);
                assert.equal(result.returnValues.t1, 1);
                assert.equal(result.returnValues.t2, 8);

                event.unsubscribe();
            });
        });

        it('should create event from the events object using event name and parameters', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'Changed(address,uint256,uint256,uint256)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params[1], {
                    topics: [
                        '0x' + sha3(signature),
                        '0x000000000000000000000000'+ address.replace('0x',''),
                        null
                    ],
                    address: address
                });
            });
            provider.injectResult('0x321');

            provider.injectValidation(function (payload) {
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
                        address: address,
                        topics: [
                            '0x' + sha3(signature),
                            '0x000000000000000000000000'+ address.replace('0x',''),
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

            var contract = new web3.eth.contract(abi, address);
            var event = contract.events[signature]({filter: {from: address}}, function (err, result) {
                assert.equal(result.returnValues.from, address);
                assert.equal(result.returnValues.amount, 1);
                assert.equal(result.returnValues.t1, 1);
                assert.equal(result.returnValues.t2, 8);

                event.unsubscribe();
            });
        });

        it('should create event using the once function and unsubscribe after one log received', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'Changed(address,uint256,uint256,uint256)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params[1], {
                    topics: [
                        '0x' + sha3(signature),
                        '0x000000000000000000000000'+ address.replace('0x',''),
                        null
                    ],
                    address: address
                });
            });
            provider.injectResult('0x321');

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_unsubscribe');
            });
            provider.injectResult(true);

            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x321',
                    result: {
                        address: address,
                        topics: [
                            '0x' + sha3(signature),
                            '0x000000000000000000000000'+ address.replace('0x',''),
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
                        address: address,
                        topics: [
                            '0x' + sha3(signature),
                            '0x000000000000000000000000'+ address.replace('0x',''),
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

            var count = 1;
            var contract = new web3.eth.contract(abi, address);
            var event = contract.once('Changed', {filter: {from: address}}, function (err, result) {
                assert.equal(result.returnValues.from, address);
                assert.equal(result.returnValues.amount, 1);
                assert.equal(result.returnValues.t1, 1);
                assert.equal(result.returnValues.t2, 8);
                assert.deepEqual(event.options.requestManager.subscriptions, {});

                assert.equal(count, 1);
                count++;

                setTimeout(done, 600);
            });
        });


        it('should create all event filter and receive two logs', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'Changed(address,uint256,uint256,uint256)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params[1], {
                    topics: [],
                    address: address
                });
            });
            provider.injectResult('0x333');

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_unsubscribe');
                done();
            });
            provider.injectResult(true);


            var contract = new web3.eth.contract(abi, address);

            var count = 0;
            var event = contract.events.allEvents(function (err, result) {
                count++;

                if(count === 1) {
                    assert.equal(result.returnValues.from, address);
                    assert.equal(result.returnValues.amount, 1);
                    assert.equal(result.returnValues.t1, 1);
                    assert.equal(result.returnValues.t2, 8);
                }
                if(count === 2) {
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
                        address: address,
                        topics: [
                            '0x' + sha3('Changed(address,uint256,uint256,uint256)'),
                            '0x000000000000000000000000'+ address.replace('0x',''),
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
                        address: address,
                        topics: [
                            '0x' + sha3('Unchanged(uint256,address,uint256)'),
                            '0x0000000000000000000000000000000000000000000000000000000000000002',
                            '0x000000000000000000000000'+ address.replace('0x','')
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
    describe('with methods', function () {
        it('should change the address', function () {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'balance(address)';

            var contract = new web3.eth.contract(abi, address);

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: '0x' + sha3(signature).slice(0, 8) + '0000000000000000000000001234567890123456789012345678901234567891',
                    to: address,
                    from: address2
                }, 'latest']);
            });

            contract.methods.balance('0x1234567890123456789012345678901234567891').call({from: address2});

            // change address
            contract.address = address2;

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: '0x' + sha3(signature).slice(0, 8) + '0000000000000000000000001234567890123456789012345678901234567891',
                    to: address2,
                    from: address
                }, 'latest']);
            });

            contract.methods.balance('0x1234567890123456789012345678901234567891').call({from: address});
        });

        it('should reset functions when resetting json interface', function () {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);

            var contract = new web3.eth.contract(abi);

            assert.isFunction(contract.methods.mySend);
            assert.isFunction(contract.events.Changed);

            contract.jsonInterface = [{
                "name": "otherSend",
                "type": "function",
                "inputs": [{
                    "name": "to",
                    "type": "address"
                }, {
                    "name": "value",
                    "type": "uint256"
                }],
                "outputs": []
            }, {
                "name":"Unchanged",
                "type":"event",
                "inputs": [
                    {"name":"value","type":"uint256","indexed":true},
                    {"name":"addressFrom","type":"address","indexed":true},
                    {"name":"t1","type":"uint256","indexed":false}
                ]
            }];

            assert.isFunction(contract.methods.otherSend);
            assert.isFunction(contract.events.Unchanged);

            assert.isUndefined(contract.methods.mySend);
            assert.isUndefined(contract.events.Changed);
        });

        it('should encode a function call', function () {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'balance(address)';

            var contract = new web3.eth.contract(abi);

            var result = contract.methods.balance(address).encodeABI();

            assert.equal(result, '0x' + sha3(signature).slice(0, 8) + '0000000000000000000000001234567890123456789012345678901234567891');
        });

        it('should encode a constructor call', function () {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'balance(address)';

            var contract = new web3.eth.contract(abi, {data: '0x1234'});

            var result = contract.methods.constructor(address, 10).encodeABI();

            assert.equal(result, '0x1234' + '0000000000000000000000001234567890123456789012345678901234567891'+ '000000000000000000000000000000000000000000000000000000000000000a');
        });

        it('should estimate a function', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'balance(address)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_estimateGas');
                assert.deepEqual(payload.params, [{
                    data: '0x' + sha3(signature).slice(0, 8) + '0000000000000000000000001234567890123456789012345678901234567891',
                    to: address
                }]);
            });
            provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000032');

            var contract = new web3.eth.contract(abi, address);

            contract.methods.balance(address).estimateGas(function (err, res) {
                assert.deepEqual(res, 50);
                done();
            });
        });

        it('should estimate the constructor', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'balance(address)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_estimateGas');
                assert.deepEqual(payload.params, [{
                    data: '0x123400000000000000000000000012345678901234567890123456789012345678910000000000000000000000000000000000000000000000000000000000000032',
                    to: address
                }]);
            });
            provider.injectResult('0x000000000000000000000000000000000000000000000000000000000000000a');

            var contract = new web3.eth.contract(abi, address, {data: '0x1234'});

            contract.methods.constructor(address, 50).estimateGas(function (err, res) {
                assert.deepEqual(res, 10);
                done();
            });
        });

        it('should call constant function', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'balance(address)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: '0x' + sha3(signature).slice(0, 8) + '0000000000000000000000001234567890123456789012345678901234567891',
                    to: address
                }, 'latest']);
            });
            provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000032');

            var contract = new web3.eth.contract(abi, address);

            contract.methods.balance(address).call(function (err, res) {
                assert.deepEqual(new BigNumber(0x32), res);
                done();
            });
        });

        it('should call constant function with default block', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'balance(address)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: '0x' + sha3(signature).slice(0, 8) + '0000000000000000000000001234567890123456789012345678901234567891',
                    to: address
                }, '0xb']);
            });
            provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000032');

            var contract = new web3.eth.contract(abi, address);

            contract.methods.balance(address).call(11)
            .then(function (r) {
                assert.deepEqual(new BigNumber(0x32), r);
                done();
            });
        });

        it('should sendTransaction to contract function', function () {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'mySend(address,uint256)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: '0x' + sha3(signature).slice(0, 8) +
                    '0000000000000000000000001234567890123456789012345678901234567891' +
                    '0000000000000000000000000000000000000000000000000000000000000011' ,
                    from: address,
                    to: address
                }]);
            });

            var contract = new web3.eth.contract(abi, address);

            contract.methods.mySend(address, 17).send({from: address});
        });

        it('should sendTransaction to contract function using the function namen incl. parameters', function () {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = '0x'+ sha3('mySend(address,uint256)').slice(0, 8);

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: signature +
                    '0000000000000000000000001234567890123456789012345678901234567891' +
                    '0000000000000000000000000000000000000000000000000000000000000011' ,
                    from: address,
                    to: address
                }]);
            });

            var contract = new web3.eth.contract(abi, address);

            contract.methods['mySend(address,uint256)'](address, 17).send({from: address});
        });

        it('should sendTransaction to contract function using the signature', function () {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = '0x'+ sha3('mySend(address,uint256)').slice(0, 8);

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: signature +
                    '0000000000000000000000001234567890123456789012345678901234567891' +
                    '0000000000000000000000000000000000000000000000000000000000000011' ,
                    from: address,
                    to: address
                }]);
            });

            var contract = new web3.eth.contract(abi, address);

            contract.methods[signature](address, 17).send({from: address});
        });

        it('should make a call with optional params', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'balance(address)';
            var count = 0;


            provider.injectValidation(function (payload) {
                count++;
                if(count > 1) return;

                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: '0x' + sha3(signature).slice(0, 8) + '0000000000000000000000001234567890123456789012345678901234567891',
                    to: address,
                    from: address,
                    gas: '0xc350'
                }, 'latest']);
            });
            provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000032');


            var contract = new web3.eth.contract(abi, address);

            contract.methods.balance(address).call({from: address, gas: 50000})
            .on('data', function (r) {
                assert.deepEqual(new BigNumber(0x32), r);
                done();
            });
        });

        it('should explicitly make a call with optional params', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'balance(address)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: '0x' + sha3(signature).slice(0, 8) + '0000000000000000000000001234567890123456789012345678901234567891',
                    to: address,
                    from: address,
                    gas: '0xc350'
                }, 'latest']);
            });
            provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000032');

            var contract = new web3.eth.contract(abi, address);

            contract.methods.balance(address).call({from: address, gas: 50000})
            .then(function (r) {
                assert.deepEqual(new BigNumber(0x32), r);
                done();
            });

        });

        it('should explicitly make a call with optional params and defaultBlock', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'balance(address)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: '0x' + sha3(signature).slice(0, 8) + '0000000000000000000000001234567890123456789012345678901234567891',
                    to: address,
                    from: address,
                    gas: '0xc350'
                }, '0xb']);
            });
            provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000032');

            var contract = new web3.eth.contract(abi, address);

            contract.methods.balance(address).call({from: address, gas: 50000}, 11)
            .then(function (r) {
                assert.deepEqual(new BigNumber(0x32), r);
                done();
            });

        });

        it('should sendTransaction with optional params', function () {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'mySend(address,uint256)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: '0x' + sha3(signature).slice(0, 8) +
                        '0000000000000000000000001234567890123456789012345678901234567891' +
                        '0000000000000000000000000000000000000000000000000000000000000011' ,
                    to: address,
                    from: address,
                    gas: '0xc350',
                    gasPrice: '0xbb8',
                    value: '0x2710'
                }]);
            });

            var contract = new web3.eth.contract(abi, address);

            contract.methods.mySend(address, 17).send({from: address, gas: 50000, gasPrice: 3000, value: 10000});
        });

        it('should explicitly sendTransaction with optional params', function () {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'mySend(address,uint256)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: '0x' + sha3(signature).slice(0, 8) +
                        '0000000000000000000000001234567890123456789012345678901234567891' +
                        '0000000000000000000000000000000000000000000000000000000000000011' ,
                    to: address,
                    from: address,
                    gas: '0xc350',
                    gasPrice: '0xbb8',
                    value: '0x2710'
                }]);
            });

            var contract = new web3.eth.contract(abi, address);

            contract.methods.mySend(address, 17).send({from: address, gas: 50000, gasPrice: 3000, value: 10000});
        });

        it('should explicitly call sendTransaction with optional params and call callback without error', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'mySend(address,uint256)';

            provider.injectValidation(function (payload) {

                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: '0x' + sha3(signature).slice(0, 8) +
                        '0000000000000000000000001234567890123456789012345678901234567891' +
                        '0000000000000000000000000000000000000000000000000000000000000011' ,
                    to: address,
                    from: address,
                    gas: '0xc350',
                    gasPrice: '0xbb8',
                    value: '0x2710'
                }]);
            });

            var contract = new web3.eth.contract(abi, address);

            contract.methods.mySend(address, 17).send({from: address, gas: 50000, gasPrice: 3000, value: 10000}, function (err) {
                assert.equal(err, null);
                done();
            });
        })

        it('should explicitly estimateGas with optional params', function () {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'mySend(address,uint256)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_estimateGas');
                assert.deepEqual(payload.params, [{
                    data: '0x' + sha3(signature).slice(0, 8) +
                        '0000000000000000000000001234567890123456789012345678901234567891' +
                        '0000000000000000000000000000000000000000000000000000000000000011' ,
                    to: address,
                    from: address,
                    gas: '0xc350',
                    gasPrice: '0xbb8',
                    value: '0x2710'
                }]);
            });

            var contract = new web3.eth.contract(abi, address);

            contract.methods.mySend(address, 17).estimateGas({from: address, gas: 50000, gasPrice: 3000, value: 10000});
        });

        it('getPastEvents should get past events and format them correctly', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'testArr(int[])';

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getLogs');
                assert.deepEqual(payload.params, [{
                    address: address,
                    topics: [
                          "0x792991ed5ba9322deaef76cff5051ce4bedaaa4d097585970f9ad8f09f54e651",
                          "0x000000000000000000000000" + address2.replace('0x',''),
                          null
                    ]
                }]);
            });

            var topic1 = [
                '0x' + sha3(signature),
                '0x000000000000000000000000'+ address.replace('0x',''),
                '0x000000000000000000000000000000000000000000000000000000000000000a'
            ];
            var topic2 = [
                '0x' + sha3(signature),
                '0x000000000000000000000000'+ address.replace('0x',''),
                '0x0000000000000000000000000000000000000000000000000000000000000003'
            ];

            provider.injectResult([{
                address: address,
                topics: topic1,
                blockNumber: '0x3',
                transactionHash: '0x1234',
                blockHash: '0x1345',
                logIndex: '0x4',
                data: '0x0000000000000000000000000000000000000000000000000000000000000002' +
                '0000000000000000000000000000000000000000000000000000000000000009'
            },
            {
                address: address,
                topics: topic2,
                blockNumber: '0x4',
                transactionHash: '0x1235',
                blockHash: '0x1346',
                logIndex: '0x1',
                data: '0x0000000000000000000000000000000000000000000000000000000000000004' +
                '0000000000000000000000000000000000000000000000000000000000000005'
            }]);

            var contract = new web3.eth.contract(abi, address);
            contract.getPastEvents('Changed',{filter: {from: address2}})
                .on('data', function (result) {

                    assert.deepEqual(result, [{
                        event: "Changed",
                        id: "log_9ff24cb4",
                        address: address,
                        topics: topic1,
                        blockNumber: 3,
                        transactionHash: '0x1234',
                        blockHash: '0x1345',
                        logIndex: 4,
                        transactionIndex: 0,
                        data: '0x0000000000000000000000000000000000000000000000000000000000000002' +
                        '0000000000000000000000000000000000000000000000000000000000000009',
                        returnValues: {
                            from: address,
                            amount: new BigNumber(0xa),
                            t1: new BigNumber(0x2),
                            t2: new BigNumber(0x9),
                        }
                    },
                        {
                            event: "Changed",
                            id: "log_29c93e15",
                            address: address,
                            topics: topic2,
                            blockNumber: 4,
                            transactionHash: '0x1235',
                            blockHash: '0x1346',
                            logIndex: 1,
                            transactionIndex: 0,
                            data: '0x0000000000000000000000000000000000000000000000000000000000000004' +
                            '0000000000000000000000000000000000000000000000000000000000000005',
                            returnValues: {
                                from: address,
                                amount: new BigNumber(0x3),
                                t1: new BigNumber(0x4),
                                t2: new BigNumber(0x5),
                            }
                        }]);

                    done();
                });

        });

        it('should call testArr method and properly parse result', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'testArr(int[])';

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: '0x' + sha3(signature).slice(0, 8) +
                        '0000000000000000000000000000000000000000000000000000000000000020' +
                        '0000000000000000000000000000000000000000000000000000000000000001' +
                        '0000000000000000000000000000000000000000000000000000000000000003',
                    to: address
                },
                'latest'
                ]);
            });

            provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000005');

            var contract = new web3.eth.contract(abi, address);
            contract.methods.testArr([3]).call()
            .then(function (result) {
                assert.deepEqual(new BigNumber(5), result);
                done();
            });

        });

        it('should call testArr method, properly parse result and return the result in a callback', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'testArr(int[])';

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: '0x' + sha3(signature).slice(0, 8) +
                        '0000000000000000000000000000000000000000000000000000000000000020' +
                        '0000000000000000000000000000000000000000000000000000000000000001' +
                        '0000000000000000000000000000000000000000000000000000000000000003',
                    to: address
                },
                'latest'
                ]);
            });
            provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000005');

            var contract = new web3.eth.contract(abi, address);

            contract.methods.testArr([3]).call(function (err, result) {
                assert.deepEqual(new BigNumber(5), result);
                done();
            });

        });
    });
    describe('with data', function () {
        it('should deploy a contract and use callback', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);

            provider.injectValidation(function () {});

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: '0x1234567000000000000000000000000555456789012345678901234567890123456789100000000000000000000000000000000000000000000000000000000000000c8' ,
                    from: address,
                    gas: '0xc350',
                    gasPrice: '0xbb8'
                }]);
            });

            var contract = new web3.eth.contract(abi);

            contract.deploy({
                from: address,
                data: '0x1234567',
                arguments: ['0x5554567890123456789012345678901234567891', 200],
                gas: 50000,
                gasPrice: 3000
            }, function (err) {
                assert.equal(err, null);
                done();
            });
        });

        it('should deploy a contract and use all promise steps', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);

            provider.injectValidation(function (payload) {

                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    data: '0x1234567000000000000000000000000123456789012345678901234567890123456789100000000000000000000000000000000000000000000000000000000000000c8' ,
                    from: address,
                    gas: '0xc350',
                    gasPrice: '0xbb8'
                }]);

            });
            provider.injectResult('0x5550000000000000000000000000000000000000000000000000000000000032');

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newBlocks', {}]);
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

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x5550000000000000000000000000000000000000000000000000000000000032']);
            });
            provider.injectResult({
                contractAddress: address
            });
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getCode');
                assert.deepEqual(payload.params, [address, 'latest']);
            });
            provider.injectResult('0x321');


            var contract = new web3.eth.contract(abi);

            contract.deploy({
                from: address,
                data: '0x1234567',
                arguments: [address, 200],
                gas: 50000,
                gasPrice: 3000
            })
            .on('transactionHash', function (value) {
                assert.equal('0x5550000000000000000000000000000000000000000000000000000000000032', value);
            })
            .on('receipt', function (receipt) {
                assert.equal(address, receipt.contractAddress);
                done();
            });
            // .on('error', function (value) {
            //     console.log('error', value);
            //     done();
            // });

        });

        // TODO add error check
    });
});

