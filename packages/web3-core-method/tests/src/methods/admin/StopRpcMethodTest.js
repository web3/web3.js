import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StopRpcMethod from '../../../../src/methods/admin/StopRpcMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * StopRpcMethod test
 */
describe('StopRpcMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StopRpcMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_stopRPC');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
