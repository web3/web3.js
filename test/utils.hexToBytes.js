var chai = require('chai');
var utils = require('../packages/web3-utils');

var assert = chai.assert;

var tests = [
    { value: '0x', expected: 0 },
    { value: '0x00', expected: '0' },
    { value: '0x01', expected: [ 1 ] },
    { value: '0x1f', expected: [ 31 ] },
    { value: '0x2d31', expected: [ 45, 49] },
    { value: '0x4a41494a453c43', expected: [ 74, 65, 73, 74, 69, 60, 67 ]},
    { value: '0x636f6e76657274', expected: [ 99, 111, 110, 118, 101, 114, 116 ]},
    { value: '0x69206c6f7665206a6176612073637269707421', expected: [ 105, 32, 108, 111, 118, 101, 32, 106, 97, 118, 97, 32, 115, 99, 114, 105, 112, 116, 33 ] }
];

describe('lib/utils/utils', function () {
    it('should turn err', function () {
        var val = [1, 2, 3];
        try {
            utils.hexToBytes(val);
            assert.fail();
        } catch (error) {
            assert(error.message.includes('Given value "'+ val +'" is not a valid hex string.'));
        }
    });

    describe('hexToBytes', function () {
        tests.forEach(function (test) {
            it('should turn ' , function (){
                var r = utils.hexToBytes(test.value).toString();
                assert.equal(r, test.expected);
            });
        });
    });
});
