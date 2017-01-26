var chai = require('chai');
var assert = chai.assert;
var FakeHttpProvider = require('./FakeHttpProvider');
var Web3 = require('../../src/index');

var clone = function (object) { return object ? JSON.parse(JSON.stringify(object)) : []; };

// TODO add tests for send transaction promiEvents

var runTests = function (obj, method, tests) {

    var testName = obj ? 'web3.' + obj : 'web';

    describe(testName, function () {
        describe(method, function () {
            tests.forEach(function (test, index) {
                it('promise test: ' + index, function (done) {

                    // given
                    var provider = new FakeHttpProvider();
                    var web3 = new Web3(provider);
                    provider.injectResult(clone(test.result));
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, test.call);
                        assert.deepEqual(payload.params, test.formattedArgs || []);
                    });

                    // if notification its sendTransaction, which needs two more results, subscription and receipt
                    if(test.notification) {
                        provider.injectResult(clone(test.result));
                        provider.injectResult(clone(test.result));
                        // fake newBlock
                        provider.injectNotification(test.notification);
                    }

                    var args = clone(test.args);

                    if(test.error) {
                        if (obj) {
                            assert.throws(web3[obj][method].bind(web3[obj], args));
                        } else {
                            assert.throws(web3[method].bind(web3, args));
                        }

                        done();

                    } else {

                        if (obj) {
                            var result = web3[obj][method].apply(web3[obj], args);
                        } else {
                            var result = web3[method].apply(web3, args);
                        }
                        //var result = (obj)
                            //? web3[obj][method].apply(null, test.args.slice(0))
                            //: web3[method].apply(null, test.args.slice(0));

                        result.then(function(result){
                            assert.deepEqual(result, test.formattedResult);
                            done();
                        });
                    }

                });

                it('callback test: ' + index, function (done) {

                    // given
                    var provider = new FakeHttpProvider();
                    var web3 = new Web3(provider);
                    provider.injectResult(clone(test.result));
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, test.call);
                        assert.deepEqual(payload.params, test.formattedArgs || []);
                    });

                    var args = clone(test.args);

                    if(test.error) {
                        if (obj) {
                            assert.throws(web3[obj][method].bind(web3[obj], args));
                        } else {
                            assert.throws(web3[method].bind(web3, args));
                        }

                        done();

                    } else {
                        // add callback
                        args.push(function (err, result) {
                            assert.deepEqual(result, test.formattedResult);
                            done();
                        });

                        // when
                        if (obj) {
                            web3[obj][method].apply(web3[obj], args);
                        } else {
                            web3[method].apply(web3, args);
                        }
                    }
                });
            });
        });
    });

};

module.exports = {
    runTests: runTests
}

