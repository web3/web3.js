import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import AdminStartRpcMethod from '../../../../src/methods/admin/AdminStartRpcMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * AdminStartRpcMethod test
 */
describe('AdminStartRpcMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new AdminStartRpcMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_startRPC');

        expect(method.parametersAmount).toEqual(4);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
