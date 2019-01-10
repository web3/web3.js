import {outputSyncingFormatter} from '../../../src/Formatters';

/**
 * OutputSyncingFormatter test
 */
describe('OutputSyncingFormatterTest', () => {
    it('call outputSyncingFormatter with valid syncing response', () => {
        const response = {
            startingBlock: '0x0',
            currentBlock: '0x0',
            highestBlock: '0x0',
            knownStates: '0x0',
            pulledStates: '0x0'
        };

        expect(outputSyncingFormatter(response)).toEqual({
            startingBlock: 0,
            currentBlock: 0,
            highestBlock: 0,
            knownStates: 0,
            pulledStates: 0
        });
    });
});
