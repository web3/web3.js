import Iban from '../../src/index';

const tests = [
    { direct: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS', address: '0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8'}
];

describe('lib/web3/iban', function () {
    describe('Iban.toAddress()', function () {
        tests.forEach(function (test) {
            it('shoud transform iban to address: ' +  test.address, function () {
                expect(Iban.toAddress(test.direct)).toBe(test.address);
            });
        });
    });
    describe('iban instance address()', function () {
        tests.forEach(function (test) {
            it('shoud transform iban to address: ' +  test.address, function () {
                var iban = new Iban(test.direct);
                expect(iban.toAddress()).toBe(test.address);
            });
        });
    });
});

