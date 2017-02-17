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
                    var result;
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
                        // inject receipt
                        provider.injectResult({
                            "blockHash": "0x6fd9e2a26ab",
                            "blockNumber": "0x15df",
                            "transactionHash": "0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
                            "transactionIndex": "0x1",
                            "contractAddress": "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
                            "cumulativeGasUsed": "0x7f110",
                            "gasUsed": "0x7f110"
                        });
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
                            result = web3[obj][method].apply(web3[obj], args);
                        } else {
                            result = web3[method].apply(web3, args);
                        }

                        result.then(function(result){
                            if(test.notification) {
                                // test receipt
                                assert.deepEqual(result, {
                                    "blockHash": "0x6fd9e2a26ab",
                                    "blockNumber": 5599,
                                    "transactionHash":"0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
                                    "transactionIndex":  1,
                                    "contractAddress":"0x407D73d8a49eeb85D32Cf465507dd71d507100c1", // checksum address
                                    "cumulativeGasUsed": 520464,
                                    "gasUsed": 520464
                                });
                            } else {
                                assert.deepEqual(result, test.formattedResult);
                            }
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

