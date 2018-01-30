var chai = require('chai');
var assert = chai.assert;
var SandboxedModule = require('sandboxed-module');

SandboxedModule.registerBuiltInSourceTransformer('istanbul');
var HttpProvider = SandboxedModule.require('../lib/web3/httpprovider', {
    requires: {
        'xhr2': require('./helpers/FakeXHR2'),
        'xmlhttprequest': require('./helpers/FakeXMLHttpRequest')
    },
    singleOnly: true
});

describe('lib/web3/httpprovider', function () {
    describe('prepareRequest', function () {
        it('should set request header', function () {
            var provider = new HttpProvider('http://localhost:8545', 0 , null, null, [{name: 'Access-Control-Allow-Origin',  value: '*'}]);
            var result = provider.prepareRequest(true);

            assert.equal(typeof result, 'object');
            assert.equal(result.headers['Access-Control-Allow-Origin'], '*');
        });
    });

    describe('send', function () {
        it('should send basic request', function () {
            var provider = new HttpProvider();
            var result = provider.send({});

            assert.equal(typeof result, 'object');
        });
    });

    describe('sendAsync', function () {
        it('should send basic async request', function (done) {
            var provider = new HttpProvider();

            provider.sendAsync({}, function (err, result) {
                assert.equal(typeof result, 'object');
                done();
            });
        });
    });

    describe('isConnected', function () {
        it('should return a boolean', function () {
            var provider = new HttpProvider();

            assert.isBoolean(provider.isConnected());
        });
    });
});
