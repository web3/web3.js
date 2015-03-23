var chai = require('chai');
var assert = chai.assert;
var web3 = require('../index');
var FakeHttpProvider = require('./helpers/FakeHttpProvider');

var method = 'getBalance';

var tests = [{
    args: [301, 2],
    formattedArgs: ['0x12d', '0x2'],
    result: '0x31981',
    formattedResult: '0x31981',
    call: 'eth_'+ method
},{
    args: ['0x12d', '0x1'],
    formattedArgs: ['0x12d', '0x1'],
    result: '0x31981',
    formattedResult: '0x31981',
    call: 'eth_'+ method
}, {
    args: [0x12d, 0x1],
    formattedArgs: ['0x12d', '0x1'],
    result: '0x31981',
    formattedResult: '0x31981',
    call: 'eth_'+ method
}, {
    args: [0x12d],
    formattedArgs: ['0x12d', web3.eth.defaultBlock],
    result: '0x31981',
    formattedResult: '0x31981',
    call: 'eth_'+ method
}];

describe('eth', function () {
    describe(method, function () {
        tests.forEach(function (test, index) {
            it('sync test: ' + index, function () {
                
                // given
                var provider = new FakeHttpProvider();
                web3.setProvider(provider);
                provider.injectResult(test.result);
                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, test.call);
                    assert.deepEqual(payload.params, test.formattedArgs);
                });

                // when 
                var result = web3.eth[method].apply(null, test.args.slice(0));
                
                // then 
                assert.equal(+test.formattedResult, result.toNumber());
            });
            
            it('async test: ' + index, function (done) {
                
                // given
                var provider = new FakeHttpProvider();
                web3.setProvider(provider);
                provider.injectResult(test.result);
                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, test.call);
                    assert.deepEqual(payload.params, test.formattedArgs);
                });
                var callback = function (err, result) {
                    assert.equal(+test.formattedResult, result.toNumber());
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

