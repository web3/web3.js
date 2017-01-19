var chai = require('chai');
var assert = chai.assert;
var FakeHttpProvider = require('./FakeHttpProvider');
var Web3 = require('../../src/index');

var clone = function (object) { return object ? JSON.parse(JSON.stringify(object)) : []; };

var runTests = function (obj, method, tests) {

    var testName = obj ? 'web3.' + obj : 'web';

    describe(testName, function () {
        describe(method, function () {
            tests.forEach(function (test, index) {
                it('promise test: ' + index, function () {

                    // given
                    var provider = new FakeHttpProvider();
                    var web3 = new Web3(provider);
                    provider.injectResult(clone(test.result));
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, test.call);
                        assert.deepEqual(payload.params, test.formattedArgs || []);
                    });

                    var args = clone(test.args)

                    // when
                    if (obj) {
                        var result = web3[obj][method].apply(web3[obj], args);
                    } else {
                        var result = web3[method].apply(web3, args);
                    }
                    // when
                    //var result = (obj)
                        //? web3[obj][method].apply(null, test.args.slice(0))
                        //: web3[method].apply(null, test.args.slice(0));

                    result.then(function(result){
                        assert.deepEqual(result, test.formattedResult);
                    });

                    // then
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
                });
            });
        });
    });

};

module.exports = {
    runTests: runTests
}

