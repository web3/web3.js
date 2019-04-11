import {inputDefaultEpochNumberFormatter} from '../../../src/Formatters';

/**
 * inputDefaultEpochNumberFormatter test
 */
describe('InputDefaultBlockNumberFormatterTest', () => {
    it('inputDefaultEpochNumberFormatter returns module defaultEpoch', () => {
        expect(inputDefaultEpochNumberFormatter(null, {defaultEpoch: 100})).toEqual(100);
    });

    it('inputDefaultEpochNumberFormatter returns the predefined block handle', () => {
        expect(inputDefaultEpochNumberFormatter('latest_state', {})).toEqual('latest_state');
    });
});
