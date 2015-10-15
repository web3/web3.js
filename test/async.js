var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../index');
var web3 = new Web3();
var FakeHttpProvider = require('./helpers/FakeHttpProvider');

// use sendTransaction as dummy
var method = 'sendTransaction';

var tests = [{
    input: {
        'from': 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS',
        'to': 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS'
    },
    formattedInput: {
        'from': '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8',
        'to': '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8'
    },
    result: '0xb',
    formattedResult: '0xb',
    call: 'eth_'+ method
}];

describe('async', function () {
    tests.forEach(function (test, index) {
        it('test: ' + index, function (done) {
            
            // given
            var provider = new FakeHttpProvider();
            web3.setProvider(provider);
            provider.injectResult(test.result);
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, test.call);
                assert.deepEqual(payload.params, [test.formattedInput]);
            });

            // when 
            web3.eth[method](test.input, function(error, result){

                // then
                assert.isNull(error);
                assert.strictEqual(test.formattedResult, result);
                
                done();
            });
            
        });

        it('error test: ' + index, function (done) {
            
            // given
            var provider = new FakeHttpProvider();
            web3.setProvider(provider);
            provider.injectError({
                    message: test.result,
                    code: -32603
            });
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, test.call);
                assert.deepEqual(payload.params, [test.formattedInput]);
            });

            // when 
            web3.eth[method](test.input, function(error, result){

                // then
                assert.isUndefined(result);
                assert.strictEqual(test.formattedResult, error.message);

                done();
            });
            
        });
    });
});

