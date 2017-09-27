var chai = require('chai');
var utils = require('../packages/web3-utils');

var assert = chai.assert;

var tests = [
    { value: function () {}, is: false},
    { value: new Function(), is: false},
    { value: 'function', is: false},
    { value: {}, is: false},
    { value: '0xc1912', is: true },
    { value: 0xc1912, is: true },
    { value: -0xc1912, is: true },
    { value: 'c1912', is: true },
    { value: '-c1912', is: true },
    { value: 345, is: true },
    { value: -345, is: true },
    { value: '0xZ1912', is: false },
    { value: 'Hello', is: false },
];

describe('lib/utils/utils', function () {
    describe('isHex', function () {
        tests.forEach(function (test) {
            it('shoud test if value ' + test.value + ' is hex: ' + test.is, function () {
                assert.equal(utils.isHex(test.value), test.is);
            });
        });
    });
});
