var chai = require('chai');
var assert = chai.assert;
var web3 = require('../../index');
var FakeHttpProvider = require('./FakeHttpProvider');

var runTests = function (obj, method, tests) {

    describe(obj, function () {
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
                    var result = web3[obj][method].apply(null, test.args.slice(0));
                    
                    // then 
                    assert.deepEqual(test.formattedResult, result);
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
                        assert.deepEqual(test.formattedResult, result);
                        done();
                    };

                    var args = test.args.slice(0);
                    args.push(callback);

                    // when
                    web3[obj][method].apply(null, args);
                });
            });
        });
    });

};

module.exports = {
    runTests: runTests
}

