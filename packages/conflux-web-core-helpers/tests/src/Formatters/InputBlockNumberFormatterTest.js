import {inputBlockAddressFormatter} from '../../../src/Formatters';
/**
 * inputBlockAddressFormatter test
 */
describe('InputBlockNumberFormatterTest', () => {
    it('inputDefaultEpochNumberFormatter returns undefined', () => {
        expect(inputBlockAddressFormatter(undefined)).toEqual(undefined);
    });

    it('inputDefaultEpochNumberFormatter returns null', () => {
        expect(inputBlockAddressFormatter(undefined)).toEqual(undefined);
    });

    it('inputDefaultEpochNumberFormatter returns "earliest"', () => {
        expect(inputBlockAddressFormatter('earliest')).toEqual('earliest');
    });

    it('inputDefaultEpochNumberFormatter returns hex string in lower case', () => {
        expect(inputBlockAddressFormatter('0X0')).toEqual('0x0');
    });

    it('inputDefaultEpochNumberFormatter returns hex string when hex is given as number', () => {
        expect(inputBlockAddressFormatter(0x0)).toEqual('0x0');
    });

    it('inputDefaultEpochNumberFormatter returns hex from given block number', () => {
        expect(inputBlockAddressFormatter(100)).toEqual('0x64');
    });
});
