var chai = require('chai');
var assert = chai.assert;
var SandboxedModule = require('sandboxed-module');

var HttpProvider = SandboxedModule.require('../lib/web3/httpprovider', {
    requires: {
        'xmlhttprequest': require('./FakeXMLHttpRequest')
    }
});

describe('httpprovider', function () {
    describe('send', function () {
        var provider = new HttpProvider();
        var result = provider.send({});

        assert.equal(typeof result, "object");
    });

    describe('sendAsync', function (done) {
        var provider = new HttpProvider();

        provider.send({}, function (err, result) {
            assert.equal(typeof result, "string");
        }); 
    });
});

