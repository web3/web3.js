var chai = require('chai');
var assert = chai.assert;
var formatters = require('../packages/web3-core-helpers/src/formatters.js');

var tests = [
    { input: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS', result: '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8' },
    { input: 'XE75JRZCTTLBSYEQBGAS7GID8DKR7QY0QA3', result: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'},
    { input: '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8', result: '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8'},
    { input: '00c5496aee77c1ba1f0854206a26dda82a81d6d8', result: '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8'},
    { input: '11f4d0a3c12e86b4b5f39b213f7e19d048276dae', result: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae' },
    { input: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae', result: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae' },
    { input: '0x11F4D0A3C12E86B4B5F39B213F7E19D048276DAE', result: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae' },
    { input: '0X11F4D0A3C12E86B4B5F39B213F7E19D048276DAE', result: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae' },
    { input: '11F4D0A3C12E86B4B5F39B213F7E19D048276DAE', result: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae' },
    { input: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', result: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae' }
];

var errorTests = [
    '0x0c5496aee77c1ba1f0854206a26dda82a81d6d8',
    '0x0c5496aee77c1ba1f0854206a26dda82a81d6d8',
    '00c5496aee77c1ba1f0854206a26dda82a81d6d',
    'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZE',
    '0x',
    '0x11f4d0a3c12e86B4b5F39b213f7E19D048276DAe',
    {},
    [],
    ''
];

describe('formatters', function () {
    describe('inputAddressFormatter correct addresses', function () {
        tests.forEach(function(test){
            it('should return the correct value', function () {
                assert.deepEqual(formatters.inputAddressFormatter(test.input), test.result);
            });
        });
    });
});


describe('formatters', function () {
    describe('inputAddressFormatter wrong addresses', function () {
        errorTests.forEach(function(test){
            it('should throw an exception', function () {
                assert.throws(function () {
                    formatters.inputAddressFormatter(test);
                }, null, null, 'Should throw:'+ test);
            });
        });
    });
});
