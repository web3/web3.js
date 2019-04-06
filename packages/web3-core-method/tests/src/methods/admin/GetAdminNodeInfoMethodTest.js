import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetAdminNodeInfoMethod from '../../../../src/methods/admin/GetAdminNodeInfoMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * GetAdminNodeInfoMethod test
 */
describe('GetAdminNodeInfoMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetAdminNodeInfoMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_nodeInfo');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
