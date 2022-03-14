var chai = require('chai');
var assert = chai.assert;
var sha3 = require('../packages/web3-utils').sha3;
var CryptoJS = require('crypto-js');
var cjsSha3 = require('crypto-js/sha3');

var ethers = require('ethers');
var ethereumjsUtil = require('ethereumjs-util');

describe('web3.sha3', function () {
    it('should return sha3 with hex prefix', function() {
        test1 = sha3('test123');
        test2 = sha3('test(int)');
        assert.deepEqual(test1, '0x' + cjsSha3('test123', {
            outputLength: 256
        }).toString());
        assert.deepEqual(test2, '0x' + cjsSha3('test(int)', {
                outputLength: 256
            }).toString());
    });
    it('should return sha3 with hex prefix when hex input', function() {
        var sha3Hex = function(value){
            if (value.length > 2 && value.startsWith('0x')) {
                value = value.slice(2);
            }
            value = CryptoJS.enc.Hex.parse(value);

            return cjsSha3(value, {
                outputLength: 256
            }).toString();
        };

        test3 = sha3('0x80');
        test4 = sha3('0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1');
        assert.deepEqual(test3, '0x' + sha3Hex('0x80'));
        assert.deepEqual(test4, '0x' + sha3Hex('0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'));
    });
    it('should return sha3 with hex prefix when hex input', function() {

        var test = function (v, e, o) {
            it('should encode ' + v + ' to ' + e, function () {
                assert.equal(sha3(v, o), e);
            });
        };

        test('test123', '0xf81b517a242b218999ec8eec0ea6e2ddbef2a367a14e93f4a32a39e260f686ad');
        test('test(int)', '0xf4d03772bec1e62fbe8c5691e1a9101e520e8f8b5ca612123694632bf3cb51b1');
        test('0x80', '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421');
        test('0x80', '0x6b03a5eef7706e3fb52a61c19ab1122fad7237726601ac665bd4def888f0e4a0');
        test('0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1', '0x82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28');

    });

    it('should not return the same sha3 hash', function() {
        assert.notEqual(
            sha3('0x265385c7f4132228a0d54eb1a9e7460b91c0cc68:9382:image'),
            sha3('0x265385c7f4132228a0d54eb1a9e7460b91c0cc68:2382:image')
        );
    });

    it('should return the same keccak256 hash as ethers', function() {
        assert.equal(
            ethers.utils.keccak256(Buffer.from('0x265385c7f4132228a0d54eb1a9e7460b91c0cc68:9382:image', 'utf-8')),
            sha3('0x265385c7f4132228a0d54eb1a9e7460b91c0cc68:9382:image')
        )
    });

    it('should return the same keccak256 hash as ethereumjsUtil', function() {
        assert.equal(
            ethereumjsUtil.bufferToHex(ethereumjsUtil.keccak256(Buffer.from('0x265385c7f4132228a0d54eb1a9e7460b91c0cc68:9382:image', 'utf-8'))),
            sha3('0x265385c7f4132228a0d54eb1a9e7460b91c0cc68:9382:image')
        )
    });

    it('should equal the expected hash', function() {
        assert.equal(
            sha3('0x265385c7f4132228a0d54eb1a9e7460b91c0cc68:9382:image'),
            '0x3ec7b047254e2b906ed1d3af460b970ce1c9001b3882e42cdcc090e6ca049fa5'
        );
    });

    it('should equal the expected hash', function() {
        assert.equal(
            sha3('0x265385c7f4132228a0d54eb1a9e7460b91c0cc68:2382:image'),
            '0x74e687805c0cfbf0065120987739a5b0ba9b3686a1a778a463bddddcd18cc432'
        );
    });

    it('should return the same keccak256 hash as ethers', function() {
        assert.equal(
            ethers.utils.keccak256('0x265385c7f4132228a0d54eb1a9e7460b91c0cc68'),
            sha3('0x265385c7f4132228a0d54eb1a9e7460b91c0cc68')
        )
    });

    it('should return the same keccak256 hash as ethers', function() {
        assert.equal(
            ethers.utils.keccak256(Buffer.from('1234', 'utf-8')),
            sha3('1234')
        )
    });
});
