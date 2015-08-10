var chai = require('chai');
var Iban = require('../lib/web3/iban.js');
var assert = chai.assert;

var tests = [
    { address: '00c5496aee77c1ba1f0854206a26dda82a81d6d8',   expected: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS'},
    { address: '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8', expected: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS'},
    { address: '0x11c5496aee77c1ba1f0854206a26dda82a81d6d8', expected: 'XE1222Q908LN1QBBU6XUQSO1OHWJIOS46OO'},
    { address: '0x52dc504a422f0e2a9e7632a34a50f1a82f8224c7', expected: 'XE499OG1EH8ZZI0KXC6N83EKGT1BM97P2O7'}
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

