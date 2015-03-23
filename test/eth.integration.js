var chai = require('chai');
var assert = chai.assert;
var web3 = require('../index');
var FakeHttpProvider = require('./FakeHttpProvider');

describe('eth', function () {
    describe('getBalance', function () {
        it('should get balance synchronously', function () {
            
            // given
            var provider = new FakeHttpProvider();
            web3.setProvider(provider);
            var address = '0x12d';
            var blockNumber = '0x1';
            var expected = '0x31981';
            provider.injectResult(expected);
            var validation = function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_getBalance');
                assert.deepEqual(payload.params, [address, blockNumber]);
            };
            provider.injectValidation(validation);

            // when 
            var result = web3.eth.getBalance(address, blockNumber);
            
            // then 
            assert.equal(expected, result);
        });
        
        it('should get balance asynchronously', function (done) {
            
            // given
            var provider = new FakeHttpProvider();
            web3.setProvider(provider);
            var address = '0x12d';
            var blockNumber = '0x1';
            var expected = '0x31981';
            provider.injectResult(expected);
            var validation = function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_getBalance');
                assert.deepEqual(payload.params, [address, blockNumber]);
            };
            provider.injectValidation(validation);
            var callback = function (err, result) {
                assert.equal(expected, result);
                done();
            };

            // when 
            web3.eth.getBalance(address, blockNumber, callback);
        });
    });
});

