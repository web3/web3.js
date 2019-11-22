var chai = require('chai');
var assert = chai.assert;
var FakeHttpProvider = require('./FakeIpcProvider');
var Web3 = require('../../packages/web3');


var runTests = function (protocol, tests) {

    describe('web3.' + protocol + '.subscribe', function () {
        tests.forEach(function (test, index) {
            it('should create a subscription for "'+ test.args[0] +'"', function (done) {

                // given
                var sub;
                var provider = new FakeHttpProvider();
                var web3 = new Web3(provider);
                var dataCount = 0;
                var changedCount = 0;

                provider.injectResult(test.firstResult);
                provider.injectResult(test.datadResult);

                provider.injectValidation(function (payload) {

                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, protocol + '_subscribe');
                    assert.deepEqual(payload.params, test.firstPayload.params);
                });
                provider.injectValidation(function (payload) {
                    assert.equal(payload.method, test.secondPayload.method);

                    done();

                });

                // add callback
                test.args.push(function(err, result) {
                    if (test.err) {
                        // TODO add subscription error check

                    } else if(test.subscriptionResults) {
                        var subRes = test.subscriptionResults.shift();

                        assert.deepEqual(result, subRes);
                    }

                    if(!test.subscriptionResults || !test.subscriptionResults.length) {

                        if(isFinite(test.dataCount))
                            assert.equal(dataCount, test.dataCount);
                        if(isFinite(test.changedCount))
                            assert.equal(changedCount, test.changedCount);

                        sub.unsubscribe();
                    }

                });

                // when
                sub = web3[test.protocol].subscribe.apply(web3[test.protocol], test.args)
                .on('data', function () {
                    dataCount++;
                })
                .on('changed', function () {
                    changedCount++;
                });


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

