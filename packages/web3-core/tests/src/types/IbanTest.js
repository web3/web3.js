import Iban from '../../../src/types/Iban';

/**
 * Iban test
 */
describe('IbanTest', () => {
    let iban;

    beforeEach(() => {
        iban = new Iban('IBAN');
    });

    it('constructor check', () => {
        expect(iban._iban).toEqual('IBAN');
    });

    it('calls isValid and returns true', () => {
        iban._iban = 'XE1222Q908LN1QBBU6XUQSO1OHWJIOS46OO';

        expect(iban.isValid()).toEqual(true);
    });

    it('calls isValid and returns false', () => {
        expect(iban.isValid()).toEqual(false);
    });

    it('calls isDirect and returns true', () => {
        iban._iban = '0000000000000000000000000000000000';
        expect(iban.isDirect()).toEqual(true);

        iban._iban = '0000000000000000000000000000000000';
        expect(iban.isDirect()).toEqual(true);
    });

    it('calls isDirect and returns false', () => {
        expect(iban.isDirect()).toEqual(false);
    });

    it('calls isIndirect and returns true', () => {
        iban._iban = '00000000000000000000';
        expect(iban.isIndirect()).toEqual(true);
    });

    it('calls isIndirect and returns false', () => {
        iban._iban = '000000000000000000000';
        expect(iban.isIndirect()).toEqual(false);
    });

    it('calls checksum and returns the checksum', () => {
        expect(iban.checksum()).toEqual('AN');
    });

    it('calls institution with a indirect Iban and returns the expected string', () => {
        iban._iban = '00000000000000000000';
        expect(iban.institution()).toEqual('0000');
    });

    it('calls institution with a direct Iban and returns the expected string', () => {
        expect(iban.institution()).toEqual('');
    });

    it('calls client with indirect and returns the expected string', () => {
        iban._iban = '00000000000000000000';
        expect(iban.client()).toEqual('000000000');
    });

    it('calls client with a direct Iban and returns the expected string', () => {
        expect(iban.client()).toEqual('');
    });

    it('calls toAddress with a direct Iban and returns the expected string', () => {
        iban._iban = '0000000000000000000000000000000000';

        expect(iban.toAddress()).toEqual('0x0');
    });

    it('calls toAddress with a indirect Iban and returns the expected string', () => {
        expect(iban.toAddress()).toEqual('');
    });

    it('calls toString and returns the expected string', () => {
        expect(iban.toString()).toEqual('IBAN');
    });

    it('calls the static method toAddress and returns the expected string', () => {
        expect(Iban.toAddress('0000000000000000000000000000000000')).toEqual('0x0');
    });

    it('calls the static method toAddress with a indirect Iban and throws an error', () => {
        expect(() => {
            Iban.toAddress('IBAN');
        }).toThrow("IBAN is indirect and can't be converted");
    });

    it('calls toIban and returns the expected string', () => {
        expect(Iban.toIban('0x0').toString()).toEqual('XE50000000000000000000000000000000');
    });

    it('calls fromAddress and throws an error', () => {
        expect(() => {
            Iban.fromAddress('0');
        }).toThrow('Provided address is not a valid address: 0');
    });

    it('calls fromBban and returns the expected Iban object', () => {
        expect(Iban.fromBban('00012030200359100100').toString()).toEqual('XE9300012030200359100100');
    });

    it('calls createIndirect and returns the expected Iban object', () => {
        expect(Iban.createIndirect({institution: 'ME', identifier: 'SAM'}).toString()).toEqual('XE63ETHMESAM');
    });

    it('calls the static isValid method', () => {
        const tests = [
            {
                object: () => {},
                is: false
            },
            /* eslint-disable no-new-func */
            {object: new Function(), is: false},
            /* eslint-enable no-new-func */
            {object: 'function', is: false},
            {object: {}, is: false},
            {object: '[]', is: false},
            {object: '[1, 2]', is: false},
            {object: '{}', is: false},
            {object: '{"a": 123, "b" :3,}', is: false},
            {object: '{"c" : 2}', is: false},
            {object: 'XE81ETHXREGGAVOFYORK', is: true},
            {object: 'XE82ETHXREGGAVOFYORK', is: false}, // control number is invalid
            {object: 'XE81ETCXREGGAVOFYORK', is: false},
            {object: 'XE81ETHXREGGAVOFYORKD', is: false},
            {object: 'XE81ETHXREGGaVOFYORK', is: false},
            {object: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS', is: true},
            {object: 'XE7438O073KYGTWWZN0F2WZ0R8PX5ZPPZS', is: false}, // control number is invalid
            {object: 'XD7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS', is: false},
            {object: 'XE1222Q908LN1QBBU6XUQSO1OHWJIOS46OO', is: true}
        ];

        tests.forEach((test) => {
            expect(Iban.isValid(test.object)).toEqual(test.is);
        });
    });
});
