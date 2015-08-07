var chai = require('chai');
var Iban = require('../lib/web3/iban.js');
var assert = chai.assert;

var tests = [
    { address: '00c5496aee77c1ba1f0854206a26dda82a81d6d8', expected: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS'},
    { address: '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8', expected: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS'}
];

describe('lib/web3/iban', function () {
    describe('fromAddress', function () {
        tests.forEach(function (test) {
            it('shoud create indirect iban: ' +  test.expected, function () {
                assert.deepEqual(Iban.fromAddress(test.address), new Iban(test.expected));
            });
        });   
    });
});

