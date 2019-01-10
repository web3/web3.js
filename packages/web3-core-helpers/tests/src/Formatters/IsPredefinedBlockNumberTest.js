import {isPredefinedBlockNumber} from '../../../src/Formatters';

/**
 * isPredefinedBlockNumber test
 */
describe('IsPredefinedBlockNumberTest', () => {
    it('isPredefinedBlockNumber returns true if its called with "latest"', () => {
        expect(isPredefinedBlockNumber('latest')).toEqual(true);
    });

    it('isPredefinedBlockNumber returns true if its called with "pending"', () => {
        expect(isPredefinedBlockNumber('pending')).toEqual(true);
    });

    it('isPredefinedBlockNumber returns true if its called with "earliest"', () => {
        expect(isPredefinedBlockNumber('earliest')).toEqual(true);
    });

    it('isPredefinedBlockNumber returns false if its called with "genesis"', () => {
        expect(isPredefinedBlockNumber('genesis')).toEqual(false);
    });
});
