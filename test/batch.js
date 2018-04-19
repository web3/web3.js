import { assert } from 'chai';
import Web3 from '../packages/web3';
import FakeIpcProvider from './helpers/FakeIpcProvider';

describe('lib/web3/batch', () => {
    describe('execute', () => {
        it('should execute batch request', (done) => {
            const provider = new FakeIpcProvider();
            const web3 = new Web3(provider);

            const result = '0x126';
            const resultVal = '294';
            const result2 = '0x127';
            const result2Val = '295';
            provider.injectBatchResults([result, result2]);

            let counter = 0;
            const callback = (_err, r) => {
                counter++;
                assert.deepEqual(r, resultVal);
            };

            const callback2 = (_err, r) => {
                assert.equal(counter, 1);
                assert.deepEqual(r, result2Val);
                done();
            };

            provider.injectValidation((payload) => {
                const first = payload[0];
                const second = payload[1];

                assert.equal(first.method, 'eth_getBalance');
                assert.deepEqual(first.params, ['0x0000000000000000000000000000000000000000', 'latest']);
                assert.equal(second.method, 'eth_getBalance');
                assert.deepEqual(second.params, ['0x0000000000000000000000000000000000000005', 'latest']);
            });

            const batch = new web3.BatchRequest();
            batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
            batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000005', 'latest', callback2));
            batch.execute();
        });

        it('should execute batch request for async properties', (done) => {
            const provider = new FakeIpcProvider();
            const web3 = new Web3(provider);

            const result = [];
            const result2 = '0xb';
            provider.injectBatchResults([result, result2]);

            let counter = 0;
            const callback = (_err, r) => {
                counter++;
                assert.isArray(result, r);
            };

            const callback2 = (_err, r) => {
                assert.equal(counter, 1);
                assert.equal(r, 11);
                done();
            };

            provider.injectValidation((payload) => {
                const first = payload[0];
                const second = payload[1];

                assert.equal(first.method, 'eth_accounts');
                assert.deepEqual(first.params, []);
                assert.equal(second.method, 'shh_post');
                assert.deepEqual(second.params, [{}]);
            });

            const batch = new web3.BatchRequest();
            batch.add(web3.eth.getAccounts.request(callback));
            batch.add(web3.shh.post.request({}, callback2));
            batch.execute();
        });

        it('should execute batch request with contract', (done) => {
            const provider = new FakeIpcProvider();
            const web3 = new Web3(provider);

            const abi = [{
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
            }];

            const address = '0x1000000000000000000000000000000000000001';
            const result = '0x126';
            const resultVal = '294';
            const result2 = '0x0000000000000000000000000000000000000000000000000000000000000123';
            const result2Val = '291';

            let counter = 0;
            const callback = (_err, r) => {
                counter++;
                assert.deepEqual(r, resultVal);
            };

            const callback2 = (_err, r) => {
                assert.equal(counter, 1);
                assert.deepEqual(r, result2Val);
            };

            const callback3 = (_err, r) => {
                counter++;
                assert.equal(counter, 2);
                assert.deepEqual(r, result2Val);
                done();
            };

            provider.injectValidation((payload) => {
                assert.equal(payload[0].method, 'eth_getBalance');
                assert.deepEqual(payload[0].params, ['0x0000000000000000000000000000000000000022', 'latest']);

                assert.equal(payload[1].method, 'eth_call');
                assert.deepEqual(payload[1].params, [{
                    to: '0x1000000000000000000000000000000000000001',
                    data: '0xe3d670d70000000000000000000000001000000000000000000000000000000000000001'
                },
                'latest' // default block
                ]);

                assert.equal(payload[2].method, 'eth_call');
                assert.deepEqual(payload[2].params, [{
                    to: '0x1000000000000000000000000000000000000001',
                    from: '0x1000000000000000000000000000000000000002',
                    data: '0xe3d670d70000000000000000000000001000000000000000000000000000000000000001'
                },
                'latest' // default block
                ]);

                assert.equal(payload[3].method, 'eth_call');
                assert.deepEqual(payload[3].params, [{
                    to: '0x1000000000000000000000000000000000000001',
                    from: '0x1000000000000000000000000000000000000003',
                    data: '0xe3d670d70000000000000000000000001000000000000000000000000000000000000001'
                },
                '0xa' // default block
                ]);

                assert.equal(payload[4].method, 'eth_call');
                assert.deepEqual(payload[4].params, [{
                    to: '0x1000000000000000000000000000000000000001',
                    data: '0xe3d670d70000000000000000000000001000000000000000000000000000000000000001'
                },
                '0xa' // default block
                ]);
            });

            const batch = new web3.BatchRequest();
            batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000022', 'latest', callback));
            batch.add(new web3.eth.Contract(abi, address)
                .methods.balance(address).call.request(callback2));
            batch.add(new web3.eth.Contract(abi, address).methods.balance(address)
                .call.request({ from: '0x1000000000000000000000000000000000000002' }, callback2));
            batch.add(new web3.eth.Contract(abi, address)
                .methods.balance(address).call.request({ from: '0x1000000000000000000000000000000000000003' }, 10, callback2));
            batch.add(new web3.eth.Contract(abi, address).methods.balance(address)
                .call.request(10, callback3));
            provider.injectBatchResults([result, result2, result2, result2, result2]);
            batch.execute();
        });

        it('should execute batch requests and receive errors', (done) => {
            const provider = new FakeIpcProvider();
            const web3 = new Web3(provider);

            const abi = [{
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
            }];

            const address = '0x1000000000000000000000000000000000000001';
            const result = 'Something went wrong';
            const result2 = 'Something went wrong 2';

            let counter = 0;
            const callback = (err, _r) => {
                counter++;
                assert.isNotNull(err);
            };

            const callback2 = (err, _r) => {
                assert.equal(counter, 1);
                assert.isNotNull(err);
                done();
            };

            provider.injectValidation((payload) => {
                const first = payload[0];
                const second = payload[1];

                assert.equal(first.method, 'eth_getBalance');
                assert.deepEqual(first.params, ['0x0000000000000000000000000000000000000000', 'latest']);
                assert.equal(second.method, 'eth_call');
                assert.deepEqual(second.params, [{
                    to: '0x1000000000000000000000000000000000000001',
                    from: '0x0000000000000000000000000000000000000000',
                    data: '0xe3d670d70000000000000000000000001000000000000000000000000000000000000001'
                },
                '0xa']);
            });

            const batch = new web3.BatchRequest();
            batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
            batch.add(new web3.eth.Contract(abi, address)
                .methods.balance(address)
                .call.request({ from: '0x0000000000000000000000000000000000000000' }, 10, callback2));
            provider.injectBatchResults([result, result2], true); // injects error
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
