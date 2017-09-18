var chai = require('chai');
var assert = chai.assert;
var FakeHttpProvider = require('./helpers/FakeIpcProvider');
var Web3 = require('../packages/web3');

var tests = [{
    hash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    id: 1,
    result: 'main'
},{
    hash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    id: 1,
    result: 'main'
},{
    hash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    id: 1,
    result: 'main'
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
}]

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
