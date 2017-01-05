var chai = require('chai');
var assert = chai.assert;
var SandboxedModule = require('sandboxed-module');

SandboxedModule.registerBuiltInSourceTransformer('istanbul');
var HttpProvider = SandboxedModule.require('../lib/web3/providers/httpprovider', {
    requires: {
        'xhr2': require('./helpers/FakeXHR2'),
        'xmlhttprequest': require('./helpers/FakeXMLHttpRequest')
    },
    singleOnly: true
});

describe('lib/web3/providers/httpprovider', function () {
    describe('sendSync', function () {
        it('should send basic request', function () {
            var provider = new HttpProvider();
            var result = provider.sendSync({});

            assert.equal(typeof result, 'object');
        });
    });

    describe('send', function () {
        it('should send basic async request', function (done) {
            var provider = new HttpProvider();

            provider.send({}, function (err, result) {
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
