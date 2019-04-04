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
        }).toThrow('Provided address "ADDRESS" is invalid, the capitalization checksum test failed.');
    });
});
