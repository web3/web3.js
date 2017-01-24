var chai = require('chai');
var Iban = require('../packages/web3-core-iban');

var assert = chai.assert;

var tests = [
    { direct: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS', address: '0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8'}
];

describe('lib/web3/iban', function () {
    describe('toAddress', function () {
        tests.forEach(function (test) {
            it('shoud transform iban to address: ' +  test.address, function () {
                var iban = new Iban(test.direct);
                assert.deepEqual(iban.address(), test.address);
            });
        });
    });
});

