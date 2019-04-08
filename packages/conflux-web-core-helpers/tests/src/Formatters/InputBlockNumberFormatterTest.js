import {inputBlockNumberFormatter} from '../../../src/Formatters';
/**
 * inputBlockNumberFormatter test
 */
describe('InputBlockNumberFormatterTest', () => {
    it('inputDefaultBlockNumberFormatter returns undefined', () => {
        expect(inputBlockNumberFormatter(undefined)).toEqual(undefined);
    });

    it('inputDefaultBlockNumberFormatter returns null', () => {
        expect(inputBlockNumberFormatter(undefined)).toEqual(undefined);
    });

    it('inputDefaultBlockNumberFormatter returns "earliest"', () => {
        expect(inputBlockNumberFormatter('earliest')).toEqual('earliest');
    });

    it('inputDefaultBlockNumberFormatter returns hex string in lower case', () => {
        expect(inputBlockNumberFormatter('0X0')).toEqual('0x0');
    });

    it('inputDefaultBlockNumberFormatter returns hex string when hex is given as number', () => {
        expect(inputBlockNumberFormatter(0x0)).toEqual('0x0');
    });

    it('inputDefaultBlockNumberFormatter returns hex from given block number', () => {
        expect(inputBlockNumberFormatter(100)).toEqual('0x64');
    });
});
