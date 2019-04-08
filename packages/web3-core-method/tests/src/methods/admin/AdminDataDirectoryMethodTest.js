import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import AdminDataDirectoryMethod from '../../../../src/methods/admin/AdminDataDirectoryMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * AdminDataDirectoryMethod test
 */
describe('AdminDataDirectoryMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new AdminDataDirectoryMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_datadir');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
