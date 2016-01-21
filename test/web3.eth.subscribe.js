var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../index');
var web3 = new Web3();
var FakeHttpProvider = require('./helpers/FakeHttpProvider');
var utils = require('../lib/utils/utils');

var tests = [{
    protocol: 'eth',
    args: ['newBlocks', {}],
    firstResult: '0x1234',
    firstPayload: {
        method: "eth_subscribe",
        params: ['newBlocks',{}]
    },
    secondResult: true,
    secondPayload: {
        method: "eth_unsubscribe"
    },
    subscription: {
        subscription: '0x1234',
        result: {
            address: '0x123456789012345678901234567890123456789',
            topics: [
                '0x4545454500000000000000001234567890123456789012345678901234567891',
                '0x0000000000000000000000000000000000000000000000000000000000000001'
            ],
            number: 2,
            data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                    '0000000000000000000000000000000000000000000000000000000000000008' 
        }
    }
},
{
    protocol: 'eth',
    args: ['logs',{}],
    firstResult: '0x4444',
    firstPayload: {
        method: "eth_subscribe",
        params: ['logs',{topics: []}]
    },
    secondResult: true,
    secondPayload: {
        method: "eth_unsubscribe"
    },
    subscription: {
        subscription: '0x4444',
        result: {
            address: '0x123456789012345678901234567890123456789',
            topics: [
                '0x0000000000000000000000000000000000000000000000000000000005656565'
            ],
            number: 2,
            data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                    '0000000000000000000000000000000000000000000000000000000000000008' 
        }
    }
},
{
    protocol: 'eth',
    args: ['logs',{address: '0x1234567890123456789012345678901234567859', topics: ['0x23']}],
    firstResult: '0x555',
    firstPayload: {
        method: "eth_subscribe",
        params: ['logs',{address: '0x1234567890123456789012345678901234567859', topics: ['0x23']}]
    },
    secondResult: true,
    secondPayload: {
        method: "eth_unsubscribe"
    },
    subscription: {
        subscription: '0x555',
        result: {
            address: '0x1234567890123456789012345678901234567859',
            topics: [
                '0x0000000000000000000000000000000000000000000000000000000005656565'
            ],
            number: 2,
            data: '0x0000000000000000000000000000000000000000000000000000000000000001' +
                    '0000000000000000000000000000000000000000000000000000000000000008' 
        }
    }
}];

var testPolling = function (tests) {
    
    describe('web3.eth.subscribe', function () {
        tests.forEach(function (test, index) {
            it('should create a subscription', function (done) {

                // given
                var sub;
                var provider = new FakeHttpProvider(); 
                web3.setProvider(provider);
                web3.reset();
                provider.injectResult(test.firstResult);
                var step = 0;
                provider.injectValidation(function (payload) {
                    if (step === 0) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_subscribe');
                        assert.deepEqual(payload.params, test.firstPayload.params);


                        step++;
                    } else if (step === 1) {
                        provider.injectResult(test.secondResult);
                        assert.equal(payload.method, 'eth_unsubscribe');
                    }

                });

                // add callback
                test.args.push(function(err, result) {
                    if (test.err) {
                        // todo
                    } else {
                        assert.deepEqual(result, test.subscription.result);
                    }
                    sub.unsubscribe();
                    done();

                });

                // when
                var sub = web3[test.protocol].subscribe.apply(web3[test.protocol], test.args);

                provider.injectNotification({
                    method: 'eth_subscription',
                    params: test.subscription
                });

            });
        }); 
    });
};

testPolling(tests);
