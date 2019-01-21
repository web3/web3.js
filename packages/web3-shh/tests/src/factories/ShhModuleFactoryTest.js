import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import Shh from '../../../src/Shh';
import MethodFactory from '../../../src/factories/MethodFactory';
import ShhModuleFactory from '../../../src/factories/ShhModuleFactory';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('../../../src/Shh');
jest.mock('../../../src/factories/MethodFactory');

/**
 * ShhModuleFactory test
 */
describe('ShhModuleFactoryTest', () => {
    let shhModuleFactory, methodModuleFactoryMock;

    beforeEach(() => {
        shhModuleFactory = new ShhModuleFactory(Utils, formatters, methodModuleFactoryMock);
    });

    it('constructor check', () => {
        expect(shhModuleFactory.utils).toEqual(Utils);

        expect(shhModuleFactory.formatters).toEqual(formatters);
    });

    it('calls createShhModule and returns the expected Shh object', () => {
        expect(shhModuleFactory.createShhModule({}, {}, {}, {})).toBeInstanceOf(Shh);
    });

    it('calls createMethodFactory and returns the expected MethodFactory object', () => {
        expect(shhModuleFactory.createMethodFactory({})).toBeInstanceOf(MethodFactory);
    });
});
