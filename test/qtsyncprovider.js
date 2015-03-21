var chai = require('chai');
var assert = chai.assert;
var SandboxedModule = require('sandboxed-module');

var QtSyncProvider = SandboxedModule.require('../lib/web3/qtsync', {
    globals: {
        navigator: require('./FakeQtNavigator')
    }
});

describe('qtprovider', function () {
    describe('send', function () {
        it('should send basic request', function () {
            var provider = new QtSyncProvider();
            var result = provider.send({});

            assert.equal(typeof result, 'object');
        });
    });
});

