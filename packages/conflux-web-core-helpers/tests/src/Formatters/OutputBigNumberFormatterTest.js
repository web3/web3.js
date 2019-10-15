import {outputBigNumberFormatter} from '../../../src/Formatters';
/**
 * Note: The real test with all cases for the Utils.toBN function can be found in the cfx-utils module
 *
 * outputBigNumberFormatter test
 */
describe('OutputBigNumberFormatterTest', () => {
    it('outputBigNumberFormatter returns BigNumber', () => {
        expect(outputBigNumberFormatter(100)).toBe('100');
    });
});
