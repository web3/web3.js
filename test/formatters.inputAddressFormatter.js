var chai = require('chai');
var assert = chai.assert;
var formatters = require('../lib/web3/formatters.js');
var BigNumber = require('bignumber.js');

var tests = [
    { input: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS', result: '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8' }, 
    { input: '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8', result: '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8'},
    { input: '00c5496aee77c1ba1f0854206a26dda82a81d6d8', result: '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8'},
    { input: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae', result: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae' }
];

var errorTests = [
    '0x0c5496aee77c1ba1f0854206a26dda82a81d6d8',
    '0x0c5496aee77c1ba1f0854206a26dda82a81d6d8',
    '00c5496aee77c1ba1f0854206a26dda82a81d6d',
    'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZE',
    '0x'
]

describe('formatters', function () {
    describe('inputAddressFormatter', function () {
        tests.forEach(function(test){
            it('should return the correct value', function () {
                assert.deepEqual(formatters.inputAddressFormatter(test.input), test.result);
            });
        });
    });
});


describe('formatters', function () {
    describe('inputAddressFormatter', function () {
        errorTests.forEach(function(test){
            it('should throw an exception', function () {
                assert.throws(function () {
                    formatters.inputAddressFormatter(test);
                });
            });
        });
    });
});
