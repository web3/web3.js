import {cloneDeep} from 'lodash';
import Hex from '../Hex';

/**
 * Hex test
 */
describe('HexTest', () => {
    beforeEach(() => {});

    it('constructor check', () => {
        hex = new Hex({hex: '0x0'}, error, params);

        expect(Hex).toHaveProperty('error');
        expect(Hex).toHaveProperty('params');
    });
});
