var chai = require('chai');
var assert = chai.assert;
var FakeHttpProvider = require('./FakeHttpProvider');
var Web3 = require('../../src/index');
var web3 = Web3();


var runTests = function (protocol, tests) {

    describe('web3.shh.subscribe', function () {
        tests.forEach(function (test, index) {
            it('should create a subscription for "'+ test.args[0] +'"', function (done) {

                // given
                var sub;
                var provider = new FakeHttpProvider();
                var web3 = new Web3(provider);

                provider.injectResult(test.firstResult);
                provider.injectResult(test.secondResult);
                var step = 0;
                provider.injectValidation(function (payload) {
                    if (step === 0) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, protocol + '_subscribe');
                        assert.deepEqual(payload.params, test.firstPayload.params);

                        step++;
                    } else if (step === 1) {

                        assert.equal(payload.method, protocol + '_unsubscribe');
                    }

                });

                // add callback
                test.args.push(function(err, result) {
                    if (test.err) {
                        // todo
                    } else if(test.subscriptionResults) {
                        var subRes = test.subscriptionResults.shift();

                        assert.deepEqual(result, subRes);
                    }

                    if(!test.subscriptionResults || !test.subscriptionResults.length) {
                        sub.unsubscribe();
                        done();
                    }

                });

                // when
                sub = web3[test.protocol].subscribe.apply(web3[test.protocol], test.args);

                // fire subscriptions
                test.subscriptions.forEach(function (subscription) {
                    provider.injectNotification({
                        method: protocol + '_subscription',
                        params: subscription
                    });
                });

            });
        });
    });
};

module.exports = {
    runTests: runTests
}

