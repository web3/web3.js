var chai = require('chai');
var assert = chai.assert;
var sha256 = require('../packages/web3-utils').sha256;
var CryptoJS = require('crypto-js');
var cjssha256 = require('crypto-js/sha256');


describe('web3.sha256', function () {
    it('should return sha256 with hex prefix', function() {
        test1 = sha256('test123');
        test2 = sha256('test(int)');
        assert.deepEqual(test1, '0x' + cjssha256('test123', {
            outputLength: 256
        }).toString());
        assert.deepEqual(test2, '0x' + cjssha256('test(int)', {
                outputLength: 256
            }).toString());
    });
    it('should return sha256 with hex prefix when hex input', function() {
        var sha256Hex = function(value){
            if (value.length > 2 && value.substr(0, 2) === '0x') {
                value = value.substr(2);
            }
            value = CryptoJS.enc.Hex.parse(value);

            return cjssha256(value, {
                outputLength: 256
            }).toString();
        };

        test3 = sha256('0x80');
        test4 = sha256('0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1');
        assert.deepEqual(test3, '0x' + sha256Hex('0x80'));
        assert.deepEqual(test4, '0x' + sha256Hex('0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'));
    });
    it('should return sha256 with hex prefix when hex input', function() {

        var test = function (v, e, o) {
            it('should encode ' + v + ' to ' + e, function () {
                assert.equal(sha256(v, o), e);
            });
        };

        test('test123', 'ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae');
        test('test(int)', 'edb0e712ea02ef205f2c83f0847bf3a80de6354c2bd8d11452d12b846269d05a');
        test('0x74657374', '3c5d98b8ae668ae718ea98a965f08197170895d0a2dbab12e3cc22f37bff50d8');
        test('0x74657374', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', { encoding: 'hex' });
        test('0x74657374696e67207765623320736861323536', '214b6276a17f9b4e4ba47780539be67a2b6bee9b01a97aff03432d2e1071bd26', { encoding: 'hex' });
        test('testing web3 sha256', '214b6276a17f9b4e4ba47780539be67a2b6bee9b01a97aff03432d2e1071bd26');
    });
});
