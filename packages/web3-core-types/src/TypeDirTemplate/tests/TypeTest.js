import {cloneDeep} from 'lodash';
import Type from '../src/Type';

/**
 * Type test
 */
describe('TypeTest', () => {
    beforeEach(() => {});

    it('constructor check', () => {
        type = new Type(txParamsTest, error, params);

        expect(type).toHaveProperty('error');
        expect(type).toHaveProperty('params');
    });
});
