import {cloneDeep} from 'lodash';
import Hex from '../Hex';

/**
 * Hex test
 */
describe('HexTest', () => {
    let hex;
    const error = {
        hex:
        "The 'hex' parameter needs to be a string composed of numbers and letters between 'a' and 'f'.\n" +
        "Use 'empty' to set a web3 empty hex object."
    };
    const initParams = {
        hex: undefined
    };

    beforeEach(() => {});

    it('constructor check', () => {
        hex = new Hex({hex: '0x0'}, error, initParams);

        expect(hex).toHaveProperty('error');
        expect(hex).toHaveProperty('props');
    });
    
    it('takes empty for empty hex', () => {
        hex = new Hex('empty', error, initParams);

        expect(hex).toHaveProperty('error');
        expect(hex).toHaveProperty('props');
    });
});
