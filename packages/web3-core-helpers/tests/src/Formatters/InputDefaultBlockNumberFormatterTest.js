import {inputDefaultBlockNumberFormatter} from '../../../src/Formatters';
/**
 * inputDefaultBlockNumberFormatter test
 */
describe('InputDefaultBlockNumberFormatterTest', () => {
    it('inputDefaultBlockNumberFormatter returns module defaultBlock', () => {
        expect(inputDefaultBlockNumberFormatter(null, {defaultBlock: 100}))
            .toEqual(100);
    });
});
