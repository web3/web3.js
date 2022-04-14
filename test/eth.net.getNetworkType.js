var chai = require('chai');
var assert = chai.assert;
var FakeHttpProvider = require('./helpers/FakeIpcProvider');
var Web3 = require('../packages/web3');

var tests = [{
    hash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    id: 1,
    result: 'main'
},{
    hash: '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d',
    id: 3,
    result: 'ropsten'
},{
    hash: '0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177',
    id: 4,
    result: 'rinkeby'
},{
    hash: '0xbf7e331f7f7c1dd2e05159666b3bf8bc7a8a3a9eb1d518969eab529dd9b88c1a',
    id: 5,
    result: 'goerli'
},{
    hash: '0xffe56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    id: 42,
    result: 'private'
},{
    hash: '0xffe56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    id: 1,
    result: 'private'
},{
    hash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    id: 42,
    result: 'private'
}];

describe('getNetworkType', function () {
    tests.forEach(function (test) {
        it('should detect the '+ test.result +' net', function (done) {
            var provider = new FakeHttpProvider();
            var web3 = new Web3(provider);

            provider.injectResult(test.id);
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'net_version');
                assert.deepEqual(payload.params, []);
            });

            provider.injectResult({
                hash: test.hash,
                blockNumber: '0x0'
            });
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_getBlockByNumber');
                assert.deepEqual(payload.params, ['0x0', false]);
            });

            web3.eth.net.getNetworkType()
            .then(function(res) {
                assert.equal(res, test.result);
                done();
            })
            .catch(function (err) {
                throw err;
                done();
            });
        });
    });
});
