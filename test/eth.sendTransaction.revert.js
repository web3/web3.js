var assert = require('chai').assert;
var FakeHttpProvider = require('./helpers/FakeHttpProvider');
var Web3 = require('../packages/web3');

describe('sendTransaction revert:', function () {
    var provider;
    var web3;

    beforeEach(function () {
        provider = new FakeHttpProvider();
        web3 = new Web3(provider);
        web3.eth.handleRevert = true;
    });

    it('Errors without revert reason string', function (done) {
        provider.injectResult('0x1234567');
        provider.injectValidation(function (payload) {
            assert.equal(payload.jsonrpc, '2.0');
            assert.equal(payload.method, 'eth_sendTransaction');
            assert.deepEqual(
                payload.params,
                [{
                    from: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
                    to: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
                    value: "0x11f71f76bb1",
                    gasPrice: "0x4b7dddc97a"
                }]
            );
        });

        provider.injectResult(null);
        provider.injectValidation(function (payload) {
            assert.equal(payload.method, 'eth_getTransactionReceipt');
        });


        // inject receipt
        provider.injectResult({
            "blockHash": "0x6fd9e2a26ab",
            "blockNumber": "0x15df",
            "transactionHash": "0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
            "transactionIndex": "0x1",
            "contractAddress": "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
            "cumulativeGasUsed": "0x7f110",
            "gasUsed": "0x7f110",
            "status": "0x0"
        });

        var options = {
            from: '0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6',
            to: '0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6',
            value: '1234567654321',
            gasPrice: '324234234234'
        };

        web3.eth.sendTransaction(options).catch(function (error) {
            assert.equal(error.receipt.status, false);
            assert.equal(error.reason, undefined);
            assert.equal(error.signature, undefined);

            done();
        });
    });

    it('Errors with revert reason string', function (done) {
        provider.injectResult('0x1234567');
        provider.injectValidation(function (payload) {
            assert.equal(payload.jsonrpc, '2.0');
            assert.equal(payload.method, 'eth_sendTransaction');
            assert.deepEqual(
                payload.params,
                [{
                    from: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
                    to: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
                    value: "0x11f71f76bb1",
                    gasPrice: "0x4b7dddc97a"
                }]
            );
        });

        provider.injectResult(null);
        provider.injectValidation(function (payload) {
            assert.equal(payload.method, 'eth_getTransactionReceipt');
        });


        // inject receipt
        provider.injectResult({
            "blockHash": "0x6fd9e2a26ab",
            "blockNumber": "0x15df",
            "transactionHash": "0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
            "transactionIndex": "0x1",
            "contractAddress": "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
            "cumulativeGasUsed": "0x7f110",
            "gasUsed": "0x7f110",
            "status": "0x0"
        });
        provider.injectValidation(function (payload) {
            assert.equal(payload.method, 'eth_getTransactionReceipt');
        });

        provider.injectResult('0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001a4e6f7420656e6f7567682045746865722070726f76696465642e000000000000');
        provider.injectValidation(function (payload) {
            assert.equal(payload.method, 'eth_call');
        });

        var options = {
            from: '0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6',
            to: '0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6',
            value: '1234567654321',
            gasPrice: '324234234234'
        };

        web3.eth.sendTransaction(options).catch(function (error) {
            assert.equal(error.receipt.status, false);
            assert.equal(error.reason, 'Not enough Ether provided.');
            assert.equal(error.signature, 'Error(String)');

            done();
        });
    });
});
