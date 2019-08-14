import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StopRpcMethod from '../../../../src/methods/admin/StopRpcMethod';

/**
 * StopRpcMethod test
 */
describe('StopRpcMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StopRpcMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_stopRPC');

        expect(method.parametersAmount).toEqual(0);
    });
});
