import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import Personal from '../../../src/Personal';
import MethodFactory from '../../../src/factories/MethodFactory';
import PersonalModuleFactory from '../../../src/factories/PersonalModuleFactory';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('../../../src/Personal');
jest.mock('../../../src/factories/MethodFactory');

/**
 * PersonalModuleFactory test
 */
describe('PersonalModuleFactoryTest', () => {
    let personalModuleFactory;

    beforeEach(() => {
        personalModuleFactory = new PersonalModuleFactory(Utils, formatters);
    });

    it('constructor check', () => {
        expect(personalModuleFactory.utils).toEqual(Utils);

        expect(personalModuleFactory.formatters).toEqual(formatters);
    });

    it('calls createPersonalModule and returns the expected Personal object', () => {
        expect(personalModuleFactory.createPersonalModule({}, {}, {}, {}, {})).toBeInstanceOf(Personal);
    });

    it('calls createMethodFactory and returns the expected MethodFactory object', () => {
        expect(personalModuleFactory.createMethodFactory({})).toBeInstanceOf(MethodFactory);
    });
});
