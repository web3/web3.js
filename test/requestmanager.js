var chai = require('chai');
var assert = chai.assert;
var FakeHttpProvider = require('./helpers/FakeIpcProvider');
var requestManager = require('../packages/web3-core-requestmanager');

// TODO: handling errors!
// TODO: validation of params!

describe('lib/web3/requestmanager', function () {
    describe('send', function () {
        it('should return expected result asynchronously', function (done) {
            var provider = new FakeHttpProvider();
            var manager = new requestManager.Manager(provider);
            var expected = 'hello_world';
            provider.injectResult(expected);

            manager.send({
                method: 'test',
                params: [1,2,3]
            }, function (error, result) {
                assert.equal(error, null);
                assert.equal(expected, result);
                done();
            });
        });
    });
    describe('destroy', function() {
        it('should unset internal properties', function() {
            var provider = new FakeHttpProvider();
            var manager = new requestManager.Manager(provider);
            manager.destroy();
            assert.isTrue(manager.destroyed);
            assert.isUndefined(manager.provider);
        });
        it('should remove DATA listeners', function() {
            var provider = new FakeHttpProvider();
            var dataEventCount = provider.listenerCount('data');
            var manager = new requestManager.Manager(provider);
            assert.equal(provider.listenerCount('data'), dataEventCount + 1);
            manager.destroy();
            assert.equal(provider.listenerCount('data'), dataEventCount);
        });
    });
});

