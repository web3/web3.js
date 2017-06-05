var chai = require('chai');
var assert = chai.assert;
var FakeHttpProvider = require('./helpers/FakeHttpProvider');
var Web3 = require('../src/index.js');
var sha3 = require('../packages/web3-utils').sha3;

describe('ens', function () {
    var provider;
    var web3;

    describe('in normal operation', function () {
        beforeEach(function() {
            provider = new FakeHttpProvider();
            web3 = new Web3(provider);

            provider.injectResult({
                timestamp: Math.floor(new Date() / 1000) - 60,
            });
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_getBlockByNumber');
                assert.deepEqual(payload.params, ['latest', false]);
            });

            provider.injectResult(1);
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'net_version');
                assert.deepEqual(payload.params, []);
            });

            provider.injectResult({
                hash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
                blockNumber: '0x0'
            });
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_getBlockByNumber');
                assert.deepEqual(payload.params, ['0x0', false]);
            });
        });

        it('should return the owner record for a name', function(done) {
            var signature = 'owner(bytes32)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(signature).slice(0, 10) + '1757b5941987904c18c7594de32c1726cda093fdddacb738cfbc4a7cd1ef4370',
                    to: '0x314159265dd8dbb310642f98f50c066173c1259b',
                }, 'latest']);
            });
            provider.injectResult("0x0000000000000000000000000123456701234567012345670123456701234567");

            web3.eth.ens.registry.owner('foobar.eth')
            .then(function(owner) {
                assert.equal(owner, "0x0123456701234567012345670123456701234567");
                done();
            })
            .catch(function(err) {
                throw err;
            });
        });

        it('should fetch the resolver for a name', function(done) {
            var signature = 'resolver(bytes32)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(signature).slice(0, 10) + '1757b5941987904c18c7594de32c1726cda093fdddacb738cfbc4a7cd1ef4370',
                    to: '0x314159265dd8dbb310642f98f50c066173c1259b',
                }, 'latest']);
            });
            provider.injectResult("0x0000000000000000000000000123456701234567012345670123456701234567");

            web3.eth.ens.registry.resolver('foobar.eth')
            .then(function(resolver) {
                assert.equal(resolver.options.address, "0x0123456701234567012345670123456701234567");
                done();
            })
            .catch(function(err) {
                throw err;
            });
        });

        it('should return the addr record for a name', function(done) {
            var resolverSig = 'resolver(bytes32)';
            var addrSig = 'addr(bytes32)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(resolverSig).slice(0, 10) + '1757b5941987904c18c7594de32c1726cda093fdddacb738cfbc4a7cd1ef4370',
                    to: '0x314159265dd8dbb310642f98f50c066173c1259b',
                }, 'latest']);
            });
            provider.injectResult("0x0000000000000000000000000123456701234567012345670123456701234567");

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(addrSig).slice(0, 10) + '1757b5941987904c18c7594de32c1726cda093fdddacb738cfbc4a7cd1ef4370',
                    to: '0x0123456701234567012345670123456701234567',
                }, 'latest']);
            });
            provider.injectResult("0x0000000000000000000000001234567012345670123456701234567012345670");

            web3.eth.ens.registry.resolver('foobar.eth')
            .then(function(resolver) {
                return resolver.methods.addr().call();
            })
            .then(function(addr) {
                assert.equal(addr, "0x1234567012345670123456701234567012345670");
                done();
            })
            .catch(function(err) {
                throw err;
            });
        });

        it('supports address', function(done) {
            var resolverSig = 'resolver(bytes32)';
            var addrSig = 'addr(bytes32)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(resolverSig).slice(0, 10) + '1757b5941987904c18c7594de32c1726cda093fdddacb738cfbc4a7cd1ef4370',
                    to: '0x314159265dd8dbb310642f98f50c066173c1259b',
                }, 'latest']);
            });
            provider.injectResult("0x0000000000000000000000000123456701234567012345670123456701234567");

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(addrSig).slice(0, 10) + '1757b5941987904c18c7594de32c1726cda093fdddacb738cfbc4a7cd1ef4370',
                    to: '0x0123456701234567012345670123456701234567',
                }, 'latest']);
            });
            provider.injectResult("0x0000000000000000000000001234567012345670123456701234567012345670");

            web3.eth.ens.address('foobar.eth')
            .then(function(addr) {
                assert.equal(addr, "0x1234567012345670123456701234567012345670");
                done();
            })
            .catch(function(err) {
                throw err;
            });
        });
    });

    it("won't resolve on an unknown network" , function (done) {
        provider = new FakeHttpProvider();
        web3 = new Web3(provider);

        provider.injectResult({
            timestamp: Math.floor(new Date() / 1000) - 60,
        });
        provider.injectValidation(function (payload) {
            assert.equal(payload.jsonrpc, '2.0');
            assert.equal(payload.method, 'eth_getBlockByNumber');
            assert.deepEqual(payload.params, ['latest', false]);
        });

        provider.injectResult(1);
        provider.injectValidation(function (payload) {
            assert.equal(payload.jsonrpc, '2.0');
            assert.equal(payload.method, 'net_version');
            assert.deepEqual(payload.params, []);
        });

        provider.injectResult({
            hash: '0x0123456701234567012345670123456701234567012345670123456701234567',
            blockNumber: '0x0'
        });
        provider.injectValidation(function (payload) {
            assert.equal(payload.jsonrpc, '2.0');
            assert.equal(payload.method, 'eth_getBlockByNumber');
            assert.deepEqual(payload.params, ['0x0', false]);
        });

        web3.eth.ens.address('foobar.eth')
        .then(function() {
            assert.isTrue(false, 'Should throw error');
            done();
        })
        .catch(function(e) {
            assert.isTrue(e instanceof Error, 'Should throw error');
            done();
        });
    });

    it("won't resolve when out of date" , function (done) {
        provider = new FakeHttpProvider();
        web3 = new Web3(provider);

        provider.injectResult({
            timestamp: Math.floor(new Date() / 1000) - 3660,
        });
        provider.injectValidation(function (payload) {
            assert.equal(payload.jsonrpc, '2.0');
            assert.equal(payload.method, 'eth_getBlockByNumber');
            assert.deepEqual(payload.params, ['latest', false]);
        });

        web3.eth.ens.address('foobar.eth')
        .then(function() {
            assert.isTrue(false, 'Should throw error');
            done();
        })
        .catch(function(e) {
            assert.isTrue(e instanceof Error, 'Should throw error');
            done();
        });
    });
});
