var chai = require('chai');
var assert = chai.assert;
var sha3 = require('../lib/utils/sha3');
var web3 = require('../index');

describe('lib/utils/sha3', function () {
    var test = function (v, e, o) {
        it('should encode ' + v + ' to ' + e, function () {
            assert.equal(sha3(v, o), e);
        });
    };

    test('test123', 'f81b517a242b218999ec8eec0ea6e2ddbef2a367a14e93f4a32a39e260f686ad');
    test('test(int)', 'f4d03772bec1e62fbe8c5691e1a9101e520e8f8b5ca612123694632bf3cb51b1');
    test('0x80', '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421', { encoding: 'hex' });
    test('0x80', '6b03a5eef7706e3fb52a61c19ab1122fad7237726601ac665bd4def888f0e4a0');
});

