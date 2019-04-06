import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import AdminStopRpcMethod from '../../../../src/methods/admin/AdminStopRpcMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * AdminStopRpcMethod test
 */
describe('AdminStopRpcMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new AdminStopRpcMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_stopRPC');

        expect(method.parametersAmount).toEqual(4);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
