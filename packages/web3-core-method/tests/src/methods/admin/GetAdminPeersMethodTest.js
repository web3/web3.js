import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetAdminPeersMethod from '../../../../src/methods/admin/GetAdminPeersMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * GetAdminPeersMethod test
 */
describe('GetAdminPeersMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetAdminPeersMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_peers');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
