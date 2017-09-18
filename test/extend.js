var chai = require('chai');
var assert = chai.assert;
var FakeHttpProvider = require('./helpers/FakeIpcProvider');
var Web3 = require('../packages/web3');
var web3 = new Web3();


var tests = [{
    methods: [{
        name: 'getGasPrice2',
        call: 'eth_gasPrice',
        outputFormatter: web3.extend.formatters.outputBigNumberFormatter
    },{
        name: 'getBalance',
        call: 'eth_getBalance',
        params: 2,
        inputFormatter: [web3.utils.toChecksumAddress, web3.extend.formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: web3.extend.formatters.outputBigNumberFormatter
    }]
},{
    property: 'admin',
    methods: [{
        name: 'getGasPrice3',
        call: 'eth_gasPrice',
        outputFormatter: web3.extend.formatters.outputBigNumberFormatter
    },{
        name: 'getBalance',
        call: 'eth_getBalance',
        params: 2,
        inputFormatter: [web3.utils.toChecksumAddress, web3.extend.formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: web3.extend.formatters.outputBigNumberFormatter
    }]
},{
    error: true,
    methods: [{
        name: 'getGasPrice4',
        outputFormatter: web3.extend.formatters.outputBigNumberFormatter
    }]
},{
    error: true,
    methods: [{
        call: 'eth_gasPrice',
        outputFormatter: web3.extend.formatters.outputBigNumberFormatter
    }]
}];

describe('web3', function () {
    describe('extend', function () {
        tests.forEach(function (test, index) {
            it('test no: ' + index, function (done) {
                var count = 1;

                var provider = new FakeHttpProvider();
                web3.setProvider(provider);

                if(test.error) {
                    assert.throws(web3.extend.bind(web3,test));

                    return done();

                } else {
                    web3.extend(test);
                }

                if(test.methods) {
                    test.methods.forEach(function(property){


                        provider.injectResult('0x1234');
                        provider.injectValidation(function (payload) {
                            assert.equal(payload.jsonrpc, '2.0');
                            assert.equal(payload.method, property.call);

                            if(test.methods.length === count)
                                done();
                            else
                                count++;
                        });

                        if(test.property) {
                            assert.isFunction(web3[test.property][property.name]);
                            web3[test.property][property.name]();
                        } else {
                            assert.isFunction(web3[property.name]);
                            web3[property.name]();
                        }
                    });
                }
            });
        });
    });
});

