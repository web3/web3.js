var chai = require('chai');
var assert = chai.assert;
var SandboxedModule = require('sandboxed-module');

SandboxedModule.registerBuiltInSourceTransformer('istanbul');
var HttpProvider = SandboxedModule.require('../packages/web3-providers-http', {
    requires: {
        'xhr2': require('./helpers/FakeXHR2'),
        // 'xmlhttprequest': require('./helpers/FakeXMLHttpRequest')
    },
    singleOnly: true
}).default;

describe('web3-providers-http', function () {
    describe('send', function () {
        it('should send basic async request', function (done) {
            var provider = new HttpProvider();

            provider.send({}, function (err, result) {
                assert.equal(typeof result, 'object');
                done();
            });
        });
    });
});
