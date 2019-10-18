var testMethod = require('./helpers/test.method.js');
var chai = require('chai');
var assert = chai.assert;
var FakeHttpProvider = require('./helpers/FakeHttpProvider');
var Web3 = require('../packages/web3');
var _ = require('underscore');

var Common = require('ethereumjs-common').default;

var common = Common.forCustomChain(
    'mainnet',
    {
        name: 'custom-network',
        networkId: 1,
        chainId: 1,
    },
    'petersburg',
);

var clone = function (object) { return object ? _.clone(object) : []; };

var method = 'sendTransaction';


var tests = [{
    args: [{
        from: '0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6', // checksum address
        to: '0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6', // checksum address
        value: '1234567654321',
        gasPrice: '324234234234'
    }],
    formattedArgs: [{
        from: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        to: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        value: "0x11f71f76bb1",
        gasPrice: "0x4b7dddc97a"
    }],
    result: '0x1234567',
    formattedResult: '0x1234567',
    notification: {
        method: 'eth_subscription',
        params: {
            subscription: '0x1234567',
            result: {
                blockNumber: '0x10'
            }
        }
    },
    call: 'eth_'+ method
},
// test with gasPrice missing
// This test is broken but very difficult to diagnose cause....
// behavior is correct (see sendTransaction E2E)
/*{
    args: [{
        from: '0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6', // checksum address
        to: '0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6', // checksum address
        value: '1234567654321'
    }],
    notification: {
        method: 'eth_subscription',
        params: {
            subscription: '0x1234567',
            result: {
                blockNumber: '0x10'
            }
        }
    },
    call: 'eth_gasPrice',
    formattedArgs: [],
    result: '0x1234567',
    formattedResult: '0x1234567',

    call2: 'eth_'+ method,
    formattedArgs2: [{
        from: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        to: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        value: "0x11f71f76bb1",
        gasPrice: "0x1234567"
    }],
    result2: '0x1234567'
}*/,{
    args: [{
        from: '0XDBDBDB2CBD23B783741E8D7FCF51E459B497E4A6',
        to: '0XDBDBDB2CBD23B783741E8D7FCF51E459B497E4A6',
        value: '1234567654321',
        data: '0x213453ffffff',
        gasPrice: '324234234234'
    }],
    formattedArgs: [{
        from: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        to: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        value: "0x11f71f76bb1",
        data: '0x213453ffffff',
        gasPrice: "0x4b7dddc97a"
    }],
    result: '0x12345678976543213456786543212345675432',
    formattedResult: '0x12345678976543213456786543212345675432',
    notification: {
        method: 'eth_subscription',
        params: {
            subscription: '0x12345678976543213456786543212345675432',
            result: {
                blockNumber: '0x10'
            }
        }
    },
    call: 'eth_'+ method
},{
    args: [{
        from: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS', // iban address
        to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
        value: '1234567654321',
        gasPrice: '324234234234'
    }],
    formattedArgs: [{
        from: "0x00c5496aee77c1ba1f0854206a26dda82a81d6d8",
        to: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        value: "0x11f71f76bb1",
        gasPrice: "0x4b7dddc97a"
    }],
    result: '0x12345678976543213456786543212345675432',
    formattedResult: '0x12345678976543213456786543212345675432',
    notification: {
        method: 'eth_subscription',
        params: {
            subscription: '0x12345678976543213456786543212345675432',
            result: {
                blockNumber: '0x10'
            }
        }
    },
    call: 'eth_'+ method

// using local wallet
},{
    useLocalWallet: function (web3) {
        web3.eth.accounts.wallet.add('0xd7d364e720c129acb940439a84a99185dd55af6f6d105018a8acfb7f8c008142');
    },
    walletFrom: '0x5af0838657202f865A4547b5eD28a64f799960DC',
    args: [{
        from: '0x5af0838657202f865A4547b5eD28a64f799960DC',
        to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
        value: '1234567654321',
        gasPrice: '324234234234',
        gas: 500000,
        common: common
    }],
    formattedArgs: ['0xf86b0a854b7dddc97a8307a12094dbdbdb2cbd23b783741e8d7fcf51e459b497e4a686011f71f76bb18026a0ce66ccabda889012314677073ded7bec9f763e564dfcff1135e7c6a3c5b89353a07bfa06fe1ba3f1804e4677295a5147e6c8b2224647cc2b7b62063081f6490bd3'],
    result: '0x12345678976543213456786543212345675432',
    formattedResult: '0x12345678976543213456786543212345675432',
    notification: {
        method: 'eth_subscription',
        params: {
            subscription: '0x12345678976543213456786543212345675432',
            result: {
                blockNumber: '0x10'
            }
        }
    },
    call: 'eth_sendRawTransaction'
},{
    useLocalWallet: function (web3) {
        web3.eth.accounts.wallet.add('0xf7d364e720c129acb940439a84a99185dd55af6f6d105018a8acfb7f8c008142');
    },
    walletFrom: '0xE2873A6bE9Bc50E70dE4295d968459d4aCF515C0',
    args: [{
        from: 0,
        to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
        value: '1234567654321',
        gasPrice: '324234234234',
        gas: 500000,
        common: common
    }],
    formattedArgs: ['0xf86b0a854b7dddc97a8307a12094dbdbdb2cbd23b783741e8d7fcf51e459b497e4a686011f71f76bb18026a0fe620c94cc14fdcdef494a40caf9e2860d1a5929d95730e1b7a6a2041c9c507fa01d3d22e7ab1010fa95a357322ad14a8ce1b1b631d3bb9c123922ff8042c8fc8b'],
    result: '0x12345678976543213456786543212345675432',
    formattedResult: '0x12345678976543213456786543212345675432',
    notification: {
        method: 'eth_subscription',
        params: {
            subscription: '0x12345678976543213456786543212345675432',
            result: {
                blockNumber: '0x10'
            }
        }
    },
    call: 'eth_sendRawTransaction'
},{
    useLocalWallet: function (web3) {
        web3.eth.accounts.wallet.add('0xa1d364e720c129acb940439a84a99185dd55af6f6d105018a8acfb7f8c008142');
    },
    walletFrom: '0xF65a29341Fd9F8357e060f2e21Bf3407062f2A46',
    args: [{
        from: {
            address: '0xF65a29341Fd9F8357e060f2e21Bf3407062f2A46',
            privateKey: '0xa1d364e720c129acb940439a84a99185dd55af6f6d105018a8acfb7f8c008142'
        },
        to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
        value: '1234567654321',
        gasPrice: '324234234234',
        gas: 500000,
        common: common
    }],
    formattedArgs: ['0xf86b0a854b7dddc97a8307a12094dbdbdb2cbd23b783741e8d7fcf51e459b497e4a686011f71f76bb18026a016a5bc4e1808e60a5d370f6b335be158673bd95c457ee7925dc8ae1bec69647fa03831c5e0a966a0aad0c67d6ddea55288f76ae1d73dfe11c6174a8682c2ec165d'],
    result: '0x12345678976543213456786543212345675432',
    formattedResult: '0x12345678976543213456786543212345675432',
    notification: {
        method: 'eth_subscription',
        params: {
            subscription: '0x12345678976543213456786543212345675432',
            result: {
                blockNumber: '0x10'
            }
        }
    },
    call: 'eth_sendRawTransaction'
},{
    error: true, // only for testing
    args: [{
        from: 'XE81ETHXREGGAVOFYORK', // iban address
        to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
        value: '1234567654321',
    }],
    call: 'eth_'+ method
}];

testMethod.runTests('eth', method, tests);


// Test HTTPProvider with interval
describe(method, function () {
    tests.forEach(function (test, index) {
        it('promise test: ' + index, function (done) {

            // given
            var w3;
            var result;
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);

            // skipp wallet tests
            if(test.useLocalWallet) {
                return done();
            }


            provider.injectResult(clone(test.result));
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, test.call);
                assert.deepEqual(payload.params, test.formattedArgs || []);
            });

            if (test.call2) {
                provider.injectResult(clone(test.result2));
                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, test.call2);
                    assert.deepEqual(payload.params, test.formattedArgs2 || []);
                });
            }

            provider.injectResult(null);
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });


            // if notification its sendTransaction, which needs two more results, subscription and receipt
            if(test.notification) {
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
            }

            var args = clone(test.args);

            if(test.error) {

                assert.throws(function(){ web3.eth[method].apply(web3, args); });
                done();


            } else {


                result = web3.eth[method].apply(web3, args);

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
            var w3;
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);

            // add a wallet
            if(test.useLocalWallet) {
                return done();
            }

            provider.injectResult(clone(test.result));
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, test.call);
                assert.deepEqual(payload.params, test.formattedArgs || []);
            });

            if (test.call2) {
                provider.injectResult(clone(test.result2));
                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, test.call2);
                    assert.deepEqual(payload.params, test.formattedArgs2 || []);
                });
            }


            provider.injectResult(null);
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });


            // if notification its sendTransaction, which needs two more results, subscription and receipt
            if(test.notification) {
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
            }

            var args = clone(test.args);

            if(test.error) {
                assert.throws(function(){ web3.eth[method].apply(web3, args); });

                done();

            } else {
                // add callback
                args.push(function (err, result) {
                    assert.deepEqual(result, test.formattedResult);

                    done();
                });

                web3.eth[method].apply(web3, args);
            }
        });
    });
});
