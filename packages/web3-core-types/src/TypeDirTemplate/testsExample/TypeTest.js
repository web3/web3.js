import {cloneDeep} from 'lodash';
import Type from '../Type';

/**
 * Type test
 */
describe('TypeTest', () => {
    beforeEach(() => {});

    it('constructor check', () => {
        type = new Type(data, error, initParams);

        expect(type).toHaveProperty('error');
        expect(type).toHaveProperty('props');
    });
});
