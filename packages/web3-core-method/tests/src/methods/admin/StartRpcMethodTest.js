import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StartRpcMethod from '../../../../src/methods/admin/StartRpcMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * StartRpcMethod test
 */
describe('StartRpcMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StartRpcMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_startRPC');

        expect(method.parametersAmount).toEqual(4);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
