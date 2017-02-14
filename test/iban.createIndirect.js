var chai = require('chai');
var assert = chai.assert;
var Iban = require('../packages/web3-eth-iban');

var tests = [
    { institution: 'XREG', identifier: 'GAVOFYORK', expected: 'XE81ETHXREGGAVOFYORK'}
];

describe('lib/web3/iban', function () {
    describe('createIndirect', function () {
        tests.forEach(function (test) {
            it('shoud create indirect iban: ' +  test.expected, function () {
                assert.deepEqual(Iban.createIndirect({
                    institution: test.institution,
                    identifier:  test.identifier
                }), new Iban(test.expected));
            });
        });
    });
});

