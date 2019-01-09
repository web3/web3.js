import {inputDefaultBlockNumberFormatter} from '../../../src/Formatters';

/**
 * inputDefaultBlockNumberFormatter test
 */
describe('InputDefaultBlockNumberFormatterTest', () => {
    it('inputDefaultBlockNumberFormatter returns module defaultBlock', () => {
        expect(inputDefaultBlockNumberFormatter(null, {defaultBlock: 100})).toEqual(100);
    });

    it('inputDefaultBlockNumberFormatter returns the predefined block handle', () => {
        expect(inputDefaultBlockNumberFormatter('latest', {})).toEqual('latest');
    });
});
