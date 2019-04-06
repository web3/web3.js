import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetAdminDataDirectoryMethod from '../../../../src/methods/admin/GetAdminDataDirectoryMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * GetAdminDataDirectoryMethod test
 */
describe('GetAdminDataDirectoryMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetAdminDataDirectoryMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_datadir');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
