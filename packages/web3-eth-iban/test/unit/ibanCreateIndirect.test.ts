import Iban from '../../src/index';

const tests = [
    { institution: 'XREG', identifier: 'GAVOFYORK', expected: 'XE81ETHXREGGAVOFYORK'}
];

describe('lib/web3/iban', function () {
    describe('createIndirect', function () {
        tests.forEach(function (test) {
            it('shoud create indirect iban: ' +  test.expected, function () {
                expect(Iban.createIndirect({
                    institution: test.institution,
                    identifier:  test.identifier
                })).toEqual(new Iban(test.expected));
            });
        });
    });
});

