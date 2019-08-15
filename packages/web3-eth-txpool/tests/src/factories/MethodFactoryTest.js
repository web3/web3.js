import {ContentMethod, InspectMethod, StatusMethod} from 'web3-core-method';

import MethodFactory from '../../../src/factories/MethodFactory';

/**
 * MethodFactory test
 */
describe('MethodFactoryTest', () => {
    let methodFactory;

    beforeEach(() => {
        methodFactory = new MethodFactory();
    });

    it('constructor check', () => {
        expect(methodFactory.methods).toEqual({
            getContent: ContentMethod,
            getInspection: InspectMethod,
            getStatus: StatusMethod
        });
    });
});
