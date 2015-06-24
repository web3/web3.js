var chai = require('chai');
var assert = chai.assert;
var SandboxedModule = require('sandboxed-module');

SandboxedModule.registerBuiltInSourceTransformer('istanbul');
var IpcProvider = SandboxedModule.require('../lib/web3/ipcprovider', {
    requires: {
        'net': require('./helpers/FakeIpcRequest')
    }
});

describe('lib/web3/ipcprovider', function () {
    describe('send', function () {
        it('should send basic request', function () {
            var provider = new IpcProvider();
            var result = provider.send({});

            assert.equal(typeof result, 'object');
        });
    });

    describe('sendAsync', function () {
        it('should send basic async request', function (done) {
            var provider = new IpcProvider();

            provider.sendAsync({id: 1}, function (err, result) {
                assert.equal(typeof result, 'object');
                done();
            });
        }); 
    });

    describe('isConnected', function () {
        it('should return a boolean', function () {
            var provider = new IpcProvider();

            assert.isBoolean(provider.isConnected());
        });

        it('should return false', function () {
            var provider = new IpcProvider();

            provider.connection._handle = null;

            assert.isFalse(provider.isConnected());
        });

        it('should return true, when a net handle is set', function () {
            var provider = new IpcProvider();

            provider.connection._handle = {fd: true};

            assert.isTrue(provider.isConnected());
        }); 
    });
});

