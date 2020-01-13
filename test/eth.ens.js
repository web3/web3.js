var chai = require('chai');
var assert = chai.assert;
var FakeHttpProvider = require('./helpers/FakeHttpProvider');
var Web3 = require('../packages/web3');
var sha3 = require('../packages/web3-utils').sha3;
var asciiToHex = require('../packages/web3-utils').asciiToHex;

describe('ens', function () {
    var provider;
    var web3;

    describe('in normal operation', function () {
        beforeEach(function () {
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

        it('should return the owner record for a name', function (done) {
            var signature = 'owner(bytes32)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(signature).slice(0, 10) + '1757b5941987904c18c7594de32c1726cda093fdddacb738cfbc4a7cd1ef4370',
                    to: '0x314159265dd8dbb310642f98f50c066173c1259b',
                }, 'latest']);
            });
            provider.injectResult('0x0000000000000000000000000123456701234567012345670123456701234567');

            web3.eth.ens.registry.owner('foobar.eth').then(function (owner) {
                assert.equal(owner, '0x0123456701234567012345670123456701234567');
                done();
            }).catch(function (err) {
                throw err;
            });

        });

        it('should fetch the resolver for a name', function (done) {
            var signature = 'resolver(bytes32)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(signature).slice(0, 10) + '1757b5941987904c18c7594de32c1726cda093fdddacb738cfbc4a7cd1ef4370',
                    to: '0x314159265dd8dbb310642f98f50c066173c1259b',
                }, 'latest']);
            });
            provider.injectResult('0x0000000000000000000000000123456701234567012345670123456701234567');

            web3.eth.ens.registry.resolver('foobar.eth').then(function (resolver) {
                assert.equal(resolver.options.address, '0x0123456701234567012345670123456701234567');
                done();
            }).catch(function (err) {
                throw err;
            });
        });

        it('should return the addr record for a name', function (done) {
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
            provider.injectResult('0x0000000000000000000000000123456701234567012345670123456701234567');

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(addrSig).slice(0, 10) + '1757b5941987904c18c7594de32c1726cda093fdddacb738cfbc4a7cd1ef4370',
                    to: '0x0123456701234567012345670123456701234567',
                }, 'latest']);
            });
            provider.injectResult('0x0000000000000000000000001234567012345670123456701234567012345670');

            web3.eth.ens.getAddress('foobar.eth').then(function (addr) {
                assert.equal(addr, '0x1234567012345670123456701234567012345670');
                done();
            }).catch(function (err) {
                throw err;
            });
        });

        it('should return x and y from an public key for en specific ens name', function (done) {
            var resolverSignature = 'resolver(bytes32)';
            var pubkeySignature = 'pubkey(bytes32)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(resolverSignature).slice(0, 10) + '1757b5941987904c18c7594de32c1726cda093fdddacb738cfbc4a7cd1ef4370',
                    to: '0x314159265dd8dbb310642f98f50c066173c1259b',
                }, 'latest']);
            });
            provider.injectResult('0x0000000000000000000000000123456701234567012345670123456701234567');

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(pubkeySignature).slice(0, 10) + '1757b5941987904c18c7594de32c1726cda093fdddacb738cfbc4a7cd1ef4370',
                    to: '0x0123456701234567012345670123456701234567',
                }, 'latest']);
            });

            var pubkeyCoordinateAsHex = asciiToHex('0x0000000000000000000000000000000000000000000000000000000000000000');
            provider.injectResult([
                pubkeyCoordinateAsHex,
                pubkeyCoordinateAsHex
            ]);

            web3.eth.ens.getPubkey('foobar.eth').then(function (result) {
                assert.equal(result[0][0], '0x3078303030303030303030303030303030303030303030303030303030303030');
                assert.equal(result[0][1], '0x3030303030303030303030303030303030303030303030303030303030303030');
                done();
            });
        });

        it('should get the content of an resolver', function (done) {
            var resolverSignature = 'resolver(bytes32)';
            var contentSignature = 'content(bytes32)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(resolverSignature).slice(0, 10) + '1757b5941987904c18c7594de32c1726cda093fdddacb738cfbc4a7cd1ef4370',
                    to: '0x314159265dd8dbb310642f98f50c066173c1259b',
                }, 'latest']);
            });
            provider.injectResult('0x0000000000000000000000000123456701234567012345670123456701234567');

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(contentSignature).slice(0, 10) + '1757b5941987904c18c7594de32c1726cda093fdddacb738cfbc4a7cd1ef4370',
                    to: '0x0123456701234567012345670123456701234567',
                }, 'latest']);
            });

            provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000000');

            web3.eth.ens.getContent('foobar.eth').then(function (result) {
                assert.equal(result, '0x0000000000000000000000000000000000000000000000000000000000000000');
                done();
            });
        });
    });


    it("won't resolve on an unknown network", function (done) {
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

        web3.eth.ens.getAddress('foobar.eth').then(function () {
            assert.isTrue(false, 'Should throw error');
            done();
        }).catch(function (e) {
            assert.isTrue(e instanceof Error, 'Should throw error');
            done();
        });
    });

    it("won't resolve when out of date", function (done) {
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

        web3.eth.ens.getAddress('foobar.eth').then(function () {
            assert.isTrue(false, 'Should throw error');
            done();
        }).catch(function (e) {
            assert.isTrue(e instanceof Error, 'Should throw error');
            done();
        });
    });

    it('should only check if the connected node is synced if at least a hour is gone', async function () {
        await web3.eth.ens.checkNetwork();

        web3.eth.ens._lastSyncCheck = (new Date() / 1000) - 3601;

        try {
            await web3.eth.ens.checkNetwork();

            assert.fail();
        } catch (error) {
            return true;
        }
    });

    describe('custom registry address', function () {
        let web3;
        let provider;
        const address = '0x314159265dD8dbb310642f98f50C066173C1259b';

        beforeEach(function () {
            provider = new FakeHttpProvider();

            // getBlock in checkNetwork
            provider.injectResult({
                timestamp: Math.floor(new Date() / 1000) - 60,
            });
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_getBlockByNumber');
                assert.deepEqual(payload.params, ['latest', false]);
            });

            web3 = new Web3(provider);
            web3.eth.ens.registryAddress = address;
        });

        it('should use the custom defined registry address in checkNetwork', async function () {
            assert(await web3.eth.ens.checkNetwork() === address);
            assert(web3.eth.ens.registryAddress === address);
        });

        it('should keep the custom defined registry address if the provider changes', async function () {
            web3.eth.setProvider(provider);

            assert(await web3.eth.ens.checkNetwork() === address);
            assert(web3.eth.ens.registryAddress === address);
        });
    });
});
