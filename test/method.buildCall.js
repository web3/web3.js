var chai = require('chai');
var assert = chai.assert;
var formatters = require('../packages/web3-core-helpers/src/formatters.js');
var FakeHttpProvider = require('./helpers/FakeHttpProvider');
var FakeIpcProvider = require('./helpers/FakeIpcProvider');
var Eth = require('../packages/web3-eth');
var Method = require('../packages/web3-core-method');

var address = '0x1234567890123456789012345678901234567891';


describe('lib/web3/method', function () {
    describe('buildCall', function () {
        it('should return a promise and resolve it', function (done) {
            var provider = new FakeHttpProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'call',
                call: 'eth_call',
                params: 2,
                inputFormatter: [formatters.inputCallFormatter, formatters.inputDefaultBlockNumberFormatter.bind({defaultBlock: 'latest'})]
            });
            method.setRequestManager(eth._requestManager);

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    data: '0xa123456'
                }, "latest"]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456'
            }).then(function (result) {

                assert.deepEqual(result, '0x1234567453543456321456321');

                done();
            });

        });
        it('should return a promise and fail it', function (done) {
            var provider = new FakeHttpProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'call',
                call: 'eth_call',
                params: 2,
                inputFormatter: [formatters.inputCallFormatter, formatters.inputDefaultBlockNumberFormatter.bind({defaultBlock: 'latest'})]
            });
            method.setRequestManager(eth._requestManager);

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    data: '0xa123456'
                },"latest"]);
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
            .catch(function (error) {
                assert.deepEqual(error, {
                    message: 'Wrong!',
                    code: 1234
                });

                done();
            });

        });

        it('should return an error, if the outputFormatter returns an error', function (done) {
            var provider = new FakeHttpProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'call',
                call: 'eth_call',
                params: 2,
                inputFormatter: [formatters.inputCallFormatter, formatters.inputDefaultBlockNumberFormatter.bind({defaultBlock: 'latest'})],
                outputFormatter: function (result) {
                    return new Error('Error!');
                }
            });
            method.setRequestManager(eth._requestManager);

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    data: '0xa123456'
                }, "latest"]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456'
            }, function (err, result) {

                assert.isTrue(err instanceof Error);
                assert.isUndefined(result);

                done();
            });

        });

        it('should return an error, if the outputFormatter throws', function (done) {
            var provider = new FakeHttpProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'call',
                call: 'eth_call',
                params: 2,
                inputFormatter: [formatters.inputCallFormatter, formatters.inputDefaultBlockNumberFormatter.bind({defaultBlock: 'latest'})],
                outputFormatter: function (result) {
                    throw new Error('Error!');
                }
            });
            method.setRequestManager(eth._requestManager);

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    data: '0xa123456'
                }, "latest"]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456'
            }, function (err, result) {

                assert.isTrue(err instanceof Error);
                assert.isUndefined(result);

                done();
            });

        });

        it('should fill in gasPrice if not given', function (done) {
            var provider = new FakeHttpProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);

            // generate send function
            var send = method.buildCall();

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getBlockByNumber');
                assert.deepEqual(payload.params, ['latest', false]);
            });

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_gasPrice');
                assert.deepEqual(payload.params, []);
            });
            provider.injectResult('0xffffdddd'); // gas price

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    data: '0xa123456',
                    gasPrice: '0x1234567453543456321456321',
                    type: '0x2'
                }]);

                done();

            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456',
                type: '0x2'
            });

        });

        it('should send legacy tx even though network supports EIP-1559', function (done) {
            var provider = new FakeHttpProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);

            // generate send function
            var send = method.buildCall();

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getBlockByNumber');
                assert.deepEqual(payload.params, ['latest', false]);
            });
            provider.injectResult({
                baseFeePerGas: "0x7",
                difficulty: "0x6cd6be3a",
                extraData: "0x796f75747562652e636f6d2f77617463683f763d6451773477395767586351",
                gasLimit: "0x1c9c381",
                gasUsed: "0x8dc073",
                hash: "0x846880b1158f434884f3637802ed09bac77eafc35b5f03b881ac88ce38a54907",
                logsBloom: "0x4020001000000000000000008000010000000000400200000001002140000008000000010000810020000840000204304000081000000b00400010000822200004200020020140000001000882000064000021303200020000400008800000000002202102000084010000090020a8000800002000000010000030300000000000000006001005000040080001010000010040018100004c0050004000000000420000000021000200000010020008100000004000080000000000000040000900080102004002000080210201081014004030200148101000002020108025000018020020102040000204240500010000002200048000401300080088000002",
                miner: "0x86864f1edf10eaf105b1bdc6e9aa8232b4c6aa00",
                mixHash: "0xa29afb1fa1aea9eeac72ff435a8fc420bbc1fa1be08223eb61f294ee32250bde",
                nonce: "0x122af1a5ccd78f3b",
                number: "0xa0d600",
                parentHash: "0x28f49150e1fe6f245655925b290f59e707d1e5c646dadaa22937169433b30294",
                receiptsRoot: "0xc97d4f9980d680053606318a5820261a1dccb556d1056b70f0d48fb384986be5",
                sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
                size: "0x2042",
                stateRoot: "0x116981b10423133ade5bd44f03c54cc3c57f4467a1c3d4b0c6d8d33a76c361ad",
                timestamp: "0x60dc24ec",
                totalDifficulty: "0x78828f2d886cbb",
                transactions: [],
                transactionsRoot: "0x738f53f745d58169da93ebbd52cc49e0c979d6ca68a6513007b546b19ab78ba4",
                uncles: []
            });

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_gasPrice');
                assert.deepEqual(payload.params, []);
            });
            provider.injectResult('0xffffdddd'); // gas price

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    data: '0xa123456',
                    type: '0x0',
                    gasPrice: '0xffffdddd',
                }]);

                done();

            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456',
                type: '0x0'
            });

        });

        var succeedOnReceipt = function () {
            var provider = new FakeIpcProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    value: '0xa',
                    gasPrice: "0x574d94bba"
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });
            provider.injectResult(null);

            provider.injectValidation(function (payload) {
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
            provider.injectValidation(function (payload) {
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

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_unsubscribe');
                assert.deepEqual(payload.params, ['0x1234567']);
            });
            provider.injectResult(true); // unsubscribe result

            return send;
        };

        it('should use promise "then" when subscribing and checking for receipt if "sendTransaction"', function (done) {

            var send = succeedOnReceipt();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                value: '0xa',
                gasPrice: '23435234234'
            }).then(function (result) {


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
        it('should use on("receipt", ...) when subscribing and checking for receipt if "sendTransaction"', function (done) {

            var send = succeedOnReceipt();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                value: '0xa',
                gasPrice: '23435234234'
            }).on('receipt', function (result) {


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


        var succeedwhenDeploying = function () {
            var provider = new FakeIpcProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager); // second parameter accounts

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    data: '0xa123456',
                    gasPrice: "0x574d94bba"
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });
            provider.injectResult(null);

            provider.injectValidation(function (payload) {
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

            provider.injectValidation(function (payload) {
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
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getCode');
                assert.deepEqual(payload.params, [address, 'latest']);
            });
            // code result
            provider.injectResult('0x321');

            return send;
        };

        it('should use promise "then" when subscribing and checking for receipt and code if "sendTransaction" deploying contract', function (done) {

            var send = succeedwhenDeploying();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).then(function (result) {

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

        it('should use on("receipt", ...) when subscribing and checking  for receipt and code if "sendTransaction" deploying contract', function (done) {

            var send = succeedwhenDeploying();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).on('receipt', function (result) {

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

        var failOnCodeEmpty = function () {
            var provider = new FakeIpcProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    data: '0xa123456',
                    gasPrice: "0x574d94bba"
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });
            provider.injectResult(null);

            provider.injectValidation(function (payload) {
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

            provider.injectValidation(function (payload) {
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
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getCode');
                assert.deepEqual(payload.params, [address, 'latest']);
            });
            // code result
            provider.injectResult('0x');

            return send;
        };

        it('should fail on promise when subscribing and check for receipt and code if "sendTransaction" and deploying contract: error if code is empty', function (done) {

            var send = failOnCodeEmpty();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).catch(function (error) {
                assert.instanceOf(error, Error);
                done();
            });

        });

        it('should fail with on("error", ...) when subscribing and check for receipt and code if "sendTransaction" and deploying contract: error if code is empty', function (done) {

            var send = failOnCodeEmpty();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).on('error', function (error) {
                assert.instanceOf(error, Error);
                done();
            });

        });

        var failOnMissingAddress = function () {
            var provider = new FakeIpcProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    data: '0xa123456',
                    gasPrice: "0x574d94bba"
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });
            provider.injectResult(null);

            provider.injectValidation(function (payload) {
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

            provider.injectValidation(function (payload) {
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
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_unsubscribe');
                assert.deepEqual(payload.params, ['0x1234567']);
            });
            // code result
            provider.injectResult(true);

            return send;
        };

        it('should fail on promise when subscribing and check for receipt and code if "sendTransaction" and deploying contract: error if receipt has no contract address', function (done) {
            var send = failOnMissingAddress();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).catch(function (error) {
                assert.instanceOf(error, Error);
                done();
            });

        });
        it('should fail with on("error", ...) when subscribing and check for receipt and code if "sendTransaction" and deploying contract: error if receipt has no contract address', function (done) {
            var send = failOnMissingAddress();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).on('error', function (error) {
                assert.instanceOf(error, Error);
            }).catch(function (error) {
                // also run catch!
                assert.instanceOf(error, Error);
                done();
            });

        });

        var failOnTimeout = function () {
            var provider = new FakeIpcProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    data: '0xa123456',
                    gasPrice: "0x574d94bba"
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });
            provider.injectResult(null);

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult('0x1234567'); // subscription id

            // fire 50 fake newBlocks
            for (i = 0; i < 51; i++) {
                setTimeout(function () {
                    provider.injectNotification({
                        method: 'eth_subscription',
                        params: {
                            subscription: '0x1234567',
                            result: {
                                blockNumber: '0x10'
                            }
                        }
                    });
                },i);

                // receipt
                provider.injectResult(null);
            }

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });

            return send;

        };

        it('should fail with promise when subscribing and check for receipt and code if "sendTransaction" and deploying contract: if not receipt after 50 blocks', function (done) {
            var send = failOnTimeout();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).catch(function (error) {
                assert.instanceOf(error, Error);
                done();
            });
        });
        it('should fail with on("error", ...) when subscribing and check for receipt and code if "sendTransaction" and deploying contract: if not receipt after 50 blocks', function (done) {
            var send = failOnTimeout();

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).on('error', function (error) {
                assert.instanceOf(error, Error);
                done();
            });

        });

        it('should give confirmation receipts with on("confirmation", ...) when subscribing "sendTransaction"', function (done) {
            var provider = new FakeIpcProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    gasPrice: "0x574d94bba"
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });
            provider.injectResult(null);

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult('0x1234567'); // subscription id

            // fire 50 fake newBlocks
            for (i = 0; i < 30; i++) {

                setTimeout(function () {
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

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });


            var countConf = 0;

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                gasPrice: '23435234234'
            })
            .on('transactionHash', function(result){
                assert.deepEqual(result, '0x1234567453543456321456321');
            })
            .on('receipt', function(result){

                assert.deepEqual(result, {
                    contractAddress: null,
                    cumulativeGasUsed: 10,
                    transactionIndex: 3,
                    blockNumber: 10,
                    blockHash: '0xafff',
                    gasUsed: 0
                });

            })
            .on('confirmation', function (conf, receipt) {

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

                if(conf === 12) {
                    done();
                }
            });

        });

        it('should subscribe to new blocks if using IpcProvider', function (done) {
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
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    value: '0xa',
                    gasPrice: "0x574d94bba"
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });
            provider.injectResult(null);

            provider.injectValidation(function (payload) {
                // here is the check.
                // will be `eth_subscribe` if subscribing.
                // will be `eth_getTransactionReceipt` if polling.
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
                done();
            });

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                value: '0xa',
                gasPrice: '23435234234'
            })
        });

        it('should use polling if using HttpProvider', function (done) {
            const provider = new FakeHttpProvider();
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
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    value: '0xa',
                    gasPrice: "0x574d94bba"
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });
            provider.injectResult(null);

            provider.injectValidation(function (payload) {
                // here is the check.
                // will be `eth_subscribe` if subscribing.
                // will be `eth_getTransactionReceipt` if polling.
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
                done();
            });

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                value: '0xa',
                gasPrice: '23435234234'
            })
        });

        it('should use polling if using provider with method `on` but no subscription capabilities', function (done) {
            this.timeout(5000);

            const provider = new FakeHttpProvider();
            // provider with method 'on' but no subscription capabilities should use polling
            provider.on = (...args) => {}
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
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    value: '0xa',
                    gasPrice: "0x574d94bba"
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });
            provider.injectResult(null);

            provider.injectValidation(function (payload) {
                // here is the check.
                // first will try subscribing with `eth_subscribe`.
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult(null);

            // after failing with `eth_subscribe`,
            // it should start polling with `eth_getTransactionReceipt`
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });
            provider.injectResult(null);

            // second poll
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });
            provider.injectResult(null);

            // third poll
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
                done();
            });
            provider.injectResult(null);

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                value: '0xa',
                gasPrice: '23435234234'
            })
        });

        it('should fallback to polling if provider support `on` but `newBlockHeaders` does not arrive in `blockHeaderTimeout` seconds', function (done) {
            const provider = new FakeHttpProvider();
            // provider with method 'on' but no subscription capabilities should use polling
            provider.on = (...args) => {}
            const eth = new Eth(provider);

            const method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);
            method.blockHeaderTimeout = 1;

            // generate send function
            const send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
                    value: '0xa',
                    gasPrice: "0x574d94bba"
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });
            provider.injectResult(null);

            provider.injectValidation(function (payload) {
                // here is the check.
                // first will try subscribing with `eth_subscribe`.
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult(null);

            // after failing with `eth_subscribe`,
            // it should start polling with `eth_getTransactionReceipt`
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
                done();
            });
            provider.injectResult(null);

            send({
                from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
                value: '0xa',
                gasPrice: '23435234234'
            })
        });
    });
});

