var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../packages/web3');
var FakeIpcProvider = require('./helpers/FakeIpcProvider');



describe('lib/web3/batch', function () {
    describe('_sortResponses', function () {
        it('should sort the responses in order of requests', function() {
            var provider = new FakeIpcProvider();
            var web3 = new Web3(provider);

            var batch = new web3.BatchRequest();
            batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', () => {}));
            batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000005', 'latest', () => {}));

            const res1 = {id: 1, result: 'res1'}
            const res2 = {id: 2, result: 'res2'}
            const res3 = {id: 3, result: 'res3'}
            const sortedResponses = batch._sortResponses([res3, res1, res2]);

            assert.deepEqual(sortedResponses, [res1, res2, res3]);
            batch.execute();
        });
    });

    describe('execute', function () {
        it('should execute batch request', function (done) {

            var provider = new FakeIpcProvider();
            var web3 = new Web3(provider);

            var result = '0x126';
            var resultVal = '294';
            var result2 = '0x127';
            var result2Val = '295';
            provider.injectBatchResults([result, result2]);

            var counter = 0;
            var callback = function (err, r) {
                counter++;
                assert.deepEqual(r, resultVal);
            };

            var callback2 = function (err, r) {
                assert.equal(counter, 1);
                assert.deepEqual(r, result2Val);
                done();
            };

            provider.injectValidation(function (payload) {
                var first = payload[0];
                var second = payload[1];

                assert.equal(first.method, 'eth_getBalance');
                assert.deepEqual(first.params, ['0x0000000000000000000000000000000000000000', 'latest']);
                assert.equal(second.method, 'eth_getBalance');
                assert.deepEqual(second.params, ['0x0000000000000000000000000000000000000005', 'latest']);
            });

            var batch = new web3.BatchRequest();
            batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
            batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000005', 'latest', callback2));
            batch.execute();
        });

        it('should execute batch request for async properties', function (done) {

            var provider = new FakeIpcProvider();
            var web3 = new Web3(provider);

            var result = [];
            var result2 = '0xb';
            provider.injectBatchResults([result, result2]);

            var counter = 0;
            var callback = function (err, r) {
                counter++;
                assert.isArray(result, r);
            };

            var callback2 = function (err, r) {
                assert.equal(counter, 1);
                assert.equal(r, 11);
                done();
            };

            provider.injectValidation(function (payload) {
                var first = payload[0];
                var second = payload[1];

                assert.equal(first.method, 'eth_accounts');
                assert.deepEqual(first.params, []);
                assert.equal(second.method, 'shh_post');
                assert.deepEqual(second.params, [{}]);
            });

            var batch = new web3.BatchRequest();
            batch.add(web3.eth.getAccounts.request(callback));
            batch.add(web3.shh.post.request({}, callback2));
            batch.execute();
        });

        it('should execute batch request with contract', function (done) {

            var provider = new FakeIpcProvider();
            var web3 = new Web3(provider);

            var abi = [{
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
            }];


            var address = '0x1000000000000000000000000000000000000001';
            var result = '0x126';
            var resultVal = '294';
            var result2 = '0x0000000000000000000000000000000000000000000000000000000000000123';
            var result2Val = '291';

            var counter = 0;
            var callback = function (err, r) {
                counter++;
                assert.deepEqual(r, resultVal);
            };

            var callback2 = function (err, r) {
                assert.equal(counter, 1);
                assert.deepEqual(r, result2Val);
            };

            var callback3 = function (err, r) {
                counter++;
                assert.equal(counter, 2);
                assert.deepEqual(r, result2Val);
                done();
            };

            provider.injectValidation(function (payload) {


                assert.equal(payload[0].method, 'eth_getBalance');
                assert.deepEqual(payload[0].params, ['0x0000000000000000000000000000000000000022', 'latest']);

                assert.equal(payload[1].method, 'eth_call');
                assert.deepEqual(payload[1].params, [{
                    'to': '0x1000000000000000000000000000000000000001',
                    'data': '0xe3d670d70000000000000000000000001000000000000000000000000000000000000001'
                },
                    'latest' // default block
                ]);

                assert.equal(payload[2].method, 'eth_call');
                assert.deepEqual(payload[2].params, [{
                    'to': '0x1000000000000000000000000000000000000001',
                    'from': '0x1000000000000000000000000000000000000002',
                    'data': '0xe3d670d70000000000000000000000001000000000000000000000000000000000000001'
                },
                    'latest' // default block
                ]);

                assert.equal(payload[3].method, 'eth_call');
                assert.deepEqual(payload[3].params, [{
                    'to': '0x1000000000000000000000000000000000000001',
                    'from': '0x1000000000000000000000000000000000000003',
                    'data': '0xe3d670d70000000000000000000000001000000000000000000000000000000000000001'
                },
                    '0xa' // default block
                ]);

                assert.equal(payload[4].method, 'eth_call');
                assert.deepEqual(payload[4].params, [{
                    'to': '0x1000000000000000000000000000000000000001',
                    'data': '0xe3d670d70000000000000000000000001000000000000000000000000000000000000001'
                },
                    '0xa' // default block
                ]);
            });


            var batch = new web3.BatchRequest();
            batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000022', 'latest', callback));
            batch.add(new web3.eth.Contract(abi, address).methods.balance(address).call.request(callback2));
            batch.add(new web3.eth.Contract(abi, address).methods.balance(address).call.request({from: '0x1000000000000000000000000000000000000002'}, callback2));
            batch.add(new web3.eth.Contract(abi, address).methods.balance(address).call.request({from: '0x1000000000000000000000000000000000000003'}, 10, callback2));
            batch.add(new web3.eth.Contract(abi, address).methods.balance(address).call.request(10, callback3));
            provider.injectBatchResults([result, result2, result2, result2, result2]);
            batch.execute();
        });

        it('should execute batch requests and receive errors', function (done) {

            var provider = new FakeIpcProvider();
            var web3 = new Web3(provider);

            var abi = [{
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
            }];


            var address = '0x1000000000000000000000000000000000000001';
            var result = 'Something went wrong';
            var result2 = 'Something went wrong 2';


            var counter = 0;
            var callback = function (err, r) {
                counter++;
                assert.isNotNull(err);
            };

            var callback2 = function (err, r) {
                assert.equal(counter, 1);
                assert.isNotNull(err);
                done();
            };

            provider.injectValidation(function (payload) {
                var first = payload[0];
                var second = payload[1];

                assert.equal(first.method, 'eth_getBalance');
                assert.deepEqual(first.params, ['0x0000000000000000000000000000000000000000', 'latest']);
                assert.equal(second.method, 'eth_call');
                assert.deepEqual(second.params, [{
                    'to': '0x1000000000000000000000000000000000000001',
                    'from': '0x0000000000000000000000000000000000000000',
                    'data': '0xe3d670d70000000000000000000000001000000000000000000000000000000000000001'
                },
                '0xa']);
            });

            var batch = new web3.BatchRequest();
            batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
            batch.add(new web3.eth.Contract(abi, address).methods.balance(address).call.request({from: '0x0000000000000000000000000000000000000000'}, 10, callback2));
            provider.injectBatchResults([result, result2], true); // injects error
            batch.execute();
        });

        it('should propagate output formatter error to callback', function(done) {
            const provider = new FakeIpcProvider();
            const web3 = new Web3(provider);

            const abi = [{
                name: 'symbol',
                type: 'function',
                inputs: [],
                constant: true,
                outputs: [{
                    name: 'symbol',
                    type: 'string'
                }]
            }];

            const address = '0x1000000000000000000000000000000000000001';
            const result = '0x0000000000000000000000000000000000000000000000000000000000000123';

            const callback = (err, _r) => {
                assert.isNotNull(err);
                done();
            };

            provider.injectValidation((payload) => {
                assert.equal(payload[0].method, 'eth_call');
                assert.deepEqual(payload[0].params, [{
                    to: '0x1000000000000000000000000000000000000001',
                    data: '0x95d89b41'
                },
                'latest']);
            });

            const batch = new web3.BatchRequest();
            batch.add(new web3.eth.Contract(abi, address)
                .methods.symbol()
                .call.request(callback));
            provider.injectBatchResults([result]); // no explicit error, it'll be thrown when formatting
            batch.execute();
        });

        it('should execute batch request with provider that supports sendAsync', function (done) {

            var provider = new FakeIpcProvider();
            var web3 = new Web3(provider);

            provider.sendAsync = provider.send
            provider.send = () => { throw new Error('send was called instead of sendAsync') }
            var result = '0x126';
            var resultVal = '294';
            var result2 = '0x127';
            var result2Val = '295';
            provider.injectBatchResults([result, result2]);

            var counter = 0;
            var callback = function (err, r) {
                counter++;
                assert.deepEqual(r, resultVal);
            };

            var callback2 = function (err, r) {
                assert.equal(counter, 1);
                assert.deepEqual(r, result2Val);
                done();
            };

            provider.injectValidation(function (payload) {
                var first = payload[0];
                var second = payload[1];

                assert.equal(first.method, 'eth_getBalance');
                assert.deepEqual(first.params, ['0x0000000000000000000000000000000000000000', 'latest']);
                assert.equal(second.method, 'eth_getBalance');
                assert.deepEqual(second.params, ['0x0000000000000000000000000000000000000005', 'latest']);
            });

            var batch = new web3.BatchRequest();
            batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
            batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000005', 'latest', callback2));
            batch.execute();
        });

    });
});
