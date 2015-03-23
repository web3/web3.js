var chai = require('chai');
var assert = chai.assert;
var web3 = require('../index');
var FakeHttpProvider = require('./FakeHttpProvider');

var method = 'getBalance';

var tests = [{
    args: ['0x12d', '0x1'],
    formattedArgs: ['0x12d', '0x1'],
    result: '0x31981',
    formattedResult: '0x31981',
    call: 'eth_getBalance'
}];

describe('eth', function () {
    describe(method, function () {
        tests.forEach(function (test, index) {
            it('sync test:' + index, function () {
                
                // given
                var provider = new FakeHttpProvider();
                web3.setProvider(provider);
                provider.injectResult(test.result);
                var validation = function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, test.call);
                    assert.deepEqual(payload.params, test.formattedArgs);
                };
                provider.injectValidation(validation);

                // when 
                var result = web3.eth[method].apply(null, test.args.slice(0));
                
                // then 
                assert.equal(test.formattedResult, result);
            });
            
            it('async test: ' + index, function (done) {
                
                // given
                var provider = new FakeHttpProvider();
                web3.setProvider(provider);
                provider.injectResult(test.result);
                var validation = function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, test.call);
                    assert.deepEqual(payload.params, test.formattedArgs);
                };
                provider.injectValidation(validation);
                var callback = function (err, result) {
                    assert.equal(test.formattedResult, result);
                    done();
                };

                var args = test.args.slice(0);
                args.push(callback);

                // when
                web3.eth[method].apply(null, args);
            });
        });
    });
});

