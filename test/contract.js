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
        "name": "value",
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
}];

var address = '0x1234567890123456789012345678901234567891';

describe('contract', function () {
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
            provider.injectResult(true);

            var contract = new web3.eth.contract(abi, address);

            var event = contract.on('Changed', {filter: {from: address}}, function (err, result, sub) {
                assert.equal(result.returnValues.from, address);
                assert.equal(result.returnValues.amount, 1);
                assert.equal(result.returnValues.t1, 1);
                assert.equal(result.returnValues.t2, 8);

                sub.unsubscribe();
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
        });

        it('should create event filter and watch immediately', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'Changed(address,uint256,uint256,uint256)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params[1], {
                    topics: [
                        '0x' + sha3(signature),
                        '0x0000000000000000000000001234567890123456789012345678901234567891',
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

            var contract = new web3.eth.contract(abi, address);

            var event = contract.on('Changed', {filter: {from: address}}, function (err, result, sub) {
                assert.equal(result.returnValues.from, address);
                assert.equal(result.returnValues.amount, 1);
                assert.equal(result.returnValues.t1, 1);
                assert.equal(result.returnValues.t2, 8);

                sub.unsubscribe();
            });

            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x321',
                    result: {
                        address: address,
                        topics: [
                            '0x' + sha3(signature),
                            '0x0000000000000000000000001234567890123456789012345678901234567891',
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

        });

        it('should create all event filter', function (done) {
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
            });
            provider.injectResult(true);


            var contract = new web3.eth.contract(abi, address);

            var event = contract.once('allEvents', function (err, result) {
                assert.equal(result.returnValues.from, address);
                assert.equal(result.returnValues.amount, 1);
                assert.equal(result.returnValues.t1, 1);
                assert.equal(result.returnValues.t2, 8);

                done();
            });


            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x333',
                    result: {
                        address: address,
                        topics: [
                            '0x' + sha3(signature),
                            '0x0000000000000000000000001234567890123456789012345678901234567891',
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
        });
    });
    describe('with methods', function () {
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

            contract.balance(address).call(function (err, res) {
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

            contract.balance(address).call(11)
            .then(function (r) {
                assert.deepEqual(new BigNumber(0x32), r);
                done();
            });
        });

        it('should sendTransaction to contract function', function () {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'send(address,uint256)';

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

            contract.send(address, 17).send({from: address});
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

            contract.balance(address).call({from: address, gas: 50000})
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

            contract.balance(address).call({from: address, gas: 50000})
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

            contract.balance(address).call({from: address, gas: 50000}, 11)
            .then(function (r) {
                assert.deepEqual(new BigNumber(0x32), r);
                done();
            });

        });

        it('should sendTransaction with optional params', function () {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'send(address,uint256)';

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

            contract.send(address, 17).send({from: address, gas: 50000, gasPrice: 3000, value: 10000});
        });

        it('should explicitly sendTransaction with optional params', function () {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'send(address,uint256)';

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

            contract.send(address, 17).send({from: address, gas: 50000, gasPrice: 3000, value: 10000});
        });

        it('should explicitly call sendTransaction with optional params and call callback without error', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'send(address,uint256)';

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

            contract.send(address, 17).send({from: address, gas: 50000, gasPrice: 3000, value: 10000}, function (err) {
                assert.equal(err, null);
                done();
            });
        })

        it('should explicitly estimateGas with optional params', function () {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);
            var signature = 'send(address,uint256)';

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

            contract.send(address, 17).estimateGas({from: address, gas: 50000, gasPrice: 3000, value: 10000});
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
            contract.testArr([3]).call()
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

            contract.testArr([3]).call(function (err, result) {
                assert.deepEqual(new BigNumber(5), result);
                done();
            });

        });
    });
    describe('with data', function () {
        // it('should deploy a contract and use callback', function (done) {
        //     var provider = new FakeHttpProvider();
        //     var web3 = new Web3(provider);
        //     var count = 0;
        //     provider.injectValidation(function (payload) {
        //         count++
        //         if(count > 1) return;
        //
        //         assert.equal(payload.method, 'eth_sendTransaction');
        //         assert.deepEqual(payload.params, [{
        //             data: '0x1234567000000000000000000000000555456789012345678901234567890123456789100000000000000000000000000000000000000000000000000000000000000c8' ,
        //             from: address,
        //             gas: '0xc350',
        //             gasPrice: '0xbb8'
        //         }]);
        //     });
        //
        //     var contract = new web3.eth.contract(abi);
        //
        //     contract.deploy({
        //         from: address,
        //         data: '0x1234567',
        //         arguments: ['0x5554567890123456789012345678901234567891', 200],
        //         gas: 50000,
        //         gasPrice: 3000
        //     }, function (err) {
        //         assert.equal(err, null);
        //         done();
        //     });
        // });

        it('should deploy a contract and use all promise steps', function (done) {
            var FakeHttpProvider = require('./helpers/FakeHttpProvider');
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

            var deploy = contract.deploy({
                from: address,
                data: '0x1234567',
                arguments: ['0x1234567890123456789012345678901234567891', 200],
                gas: 50000,
                gasPrice: 3000
            });
            deploy.on('transactionHash', function (value) {
                assert.equal('0x5550000000000000000000000000000000000000000000000000000000000032', value);
            });
            deploy.on('mined', function (value) {
                assert.equal(address, value.contractAddress);
                done();
            });
            // deploy.on('error', function (value) {
            //     console.log('error', value);
            //     done();
            // });

        });
    });
});

