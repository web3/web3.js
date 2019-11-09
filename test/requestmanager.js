var chai = require('chai');
var assert = chai.assert;
var FakeHttpProvider = require('./helpers/FakeIpcProvider');
var Manager = require('../packages/web3-core-requestmanager').Manager;

// TODO: handling errors!
// TODO: validation of params!

describe('lib/web3/requestmanager', function () {
    describe('send', function () {
        it('should return expected result asynchronously', function (done) {
            var provider = new FakeHttpProvider();
            var manager = new Manager(provider);
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
});

