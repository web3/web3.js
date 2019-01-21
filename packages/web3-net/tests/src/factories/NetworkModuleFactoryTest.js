import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import Network from '../../../src/Network';
import MethodFactory from '../../../src/factories/MethodFactory';
import NetworkModuleFactory from '../../../src/factories/NetworkModuleFactory';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('../../../src/Network');

/**
 * NetworkModuleFactory test
 */
describe('NetworkModuleFactoryTest', () => {
    let networkModuleFactory;

    beforeEach(() => {
        networkModuleFactory = new NetworkModuleFactory(Utils, formatters);
    });

    it('constructor check', () => {
        expect(networkModuleFactory.utils).toEqual(Utils);

        expect(networkModuleFactory.formatters).toEqual(formatters);
    });

    it('calls createNetworkModule and returns the expected Network object', () => {
        expect(networkModuleFactory.createNetworkModule({}, {}, {}, {})).toBeInstanceOf(Network);
    });

    it('calls createMethodFactory and returns the expected MethodFactory object', () => {
        expect(networkModuleFactory.createMethodFactory({})).toBeInstanceOf(MethodFactory);
    });
});
