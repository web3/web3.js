import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {ContentMethod, InspectMethod, StatusMethod} from 'web3-core-method';

import MethodFactory from '../../../src/factories/MethodFactory';

// Mocks
jest.mock('web3-utils');
jest.mock('web3-core-helpers');

/**
 * MethodFactory test
 */
describe('MethodFactoryTest', () => {
    let methodFactory;

    beforeEach(() => {
        methodFactory = new MethodFactory(Utils, formatters);
    });

    it('constructor check', () => {
        expect(methodFactory.utils).toEqual(Utils);

        expect(methodFactory.formatters).toEqual(formatters);
    });

    it('JSON-RPC methods check', () => {
        expect(methodFactory.methods).toEqual({
            getContent: ContentMethod,
            getInspection: InspectMethod,
            getStatus: StatusMethod
        });
    });
});
