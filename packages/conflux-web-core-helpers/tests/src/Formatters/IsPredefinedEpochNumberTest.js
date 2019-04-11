import {isPredefinedEpochNumber} from '../../../src/Formatters';

/**
 * isPredefinedEpochNumber test
 */
describe('IsPredefinedBlockNumberTest', () => {
    it('isPredefinedEpochNumber returns true if its called with "latest_state"', () => {
        expect(isPredefinedEpochNumber('latest_state')).toEqual(true);
    });

    it('isPredefinedEpochNumber returns true if its called with "latest_mined"', () => {
        expect(isPredefinedEpochNumber('latest_mined')).toEqual(true);
    });

    it('isPredefinedEpochNumber returns true if its called with "earliest"', () => {
        expect(isPredefinedEpochNumber('earliest')).toEqual(true);
    });

    it('isPredefinedEpochNumber returns false if its called with "genesis"', () => {
        expect(isPredefinedEpochNumber('genesis')).toEqual(false);
    });
});
