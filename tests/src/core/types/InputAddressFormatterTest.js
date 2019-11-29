import {inputAddressFormatter} from '../../../src/Formatters';

/**
 * inputAddressFormatter test
 */
describe('InputAddressFormatterTest', () => {
    it('inputAddressFormatter returns formatted address', () => {
        expect(inputAddressFormatter('0x03c9a938ff7f54090d0d99e2c6f80380510ea078')).toEqual(
            '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        );
    });

    it('inputAddressFormatter throws error because of invalid address', () => {
        expect(() => {
            inputAddressFormatter('ADDRESS');
        }).toThrow(
            'Provided address "ADDRESS" is invalid, the capitalization checksum test failed, or its an indrect IBAN address which can\'t be converted.'
        );
    });

    it('inputAddressFormatter throws error because of invalid iban', () => {
        expect(() => {
            inputAddressFormatter('XD7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS');
        }).toThrow(
            'Provided address "XD7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS" is invalid, the capitalization checksum test failed, or its an indrect IBAN address which can\'t be converted.'
        );
    });

    it('inputAddressFormatter gets valid IBAN and returns formatted address', () => {
        expect(inputAddressFormatter('XE1222Q908LN1QBBU6XUQSO1OHWJIOS46OO')).toEqual(
            '0x11c5496aee77c1ba1f0854206a26dda82a81d6d8'
        );
    });
});
