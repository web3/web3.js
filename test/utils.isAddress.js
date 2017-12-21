var chai = require('chai');
var utils = require('../packages/web3-utils');

var assert = chai.assert;

var tests = [
    { value: function () {}, is: false},
    { value: new Function(), is: false},
    { value: 'function', is: false},
    { value: {}, is: false},
    { value: '0xc6d9d2cd449a754c494264e1809c50e34d64562b', is: true },
    { value: 'c6d9d2cd449a754c494264e1809c50e34d64562b', is: true },
    { value: '0xE247A45c287191d435A8a5D72A7C8dc030451E9F', is: true },
    { value: '0xE247a45c287191d435A8a5D72A7C8dc030451E9F', is: false },
    { value: '0xe247a45c287191d435a8a5d72a7c8dc030451e9f', is: true },
    { value: '0xE247A45C287191D435A8A5D72A7C8DC030451E9F', is: true },
    { value: '0XE247A45C287191D435A8A5D72A7C8DC030451E9F', is: true }
];

describe('lib/utils/utils', function () {
    describe('isAddress', function () {
        tests.forEach(function (test) {
            it('shoud test if value ' + test.value + ' is address: ' + test.is, function () {
                assert.equal(utils.isAddress(test.value), test.is);
            });
        });
    });
});
