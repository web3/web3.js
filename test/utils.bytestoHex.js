var chai = require('chai');
var utils = require('../packages/web3-utils');
var assert = chai.assert;

var tests = [
    { value: 0, expected: '0x' },
    { value: '0', expected: '0x00' },
    { value: [ 1 ], expected: '0x01' },
    { value: [ 31 ], expected: '0x1f' },
    { value: [ 45, 49], expected: '0x2d31' },
    { value: [ 74, 65, 73, 74, 69, 60, 67 ], expected: '0x4a41494a453c43'},
    { value: [ 99, 111, 110, 118, 101, 114, 116 ], expected: '0x636f6e76657274'},
    { value: [ 105, 32, 108, 111, 118, 101, 32, 106, 97, 118, 97, 32, 115, 99, 114, 105, 112, 116, 33 ], expected: '0x69206c6f7665206a6176612073637269707421' }
    ];

describe('lib/utils/utils', function () {
    describe('bytesToHex', function () {
        tests.forEach(function (test) {
            it(`should turn ${tests.value} to ${tests.expected}`, function () {
                assert.strictEqual(utils.bytesToHex(test.value), test.expected);
            });
        });
    });
});
