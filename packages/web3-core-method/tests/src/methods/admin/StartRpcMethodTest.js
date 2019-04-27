import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StartRpcMethod from '../../../../src/methods/admin/StartRpcMethod';

/**
 * StartRpcMethod test
 */
describe('StartRpcMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StartRpcMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_startRPC');

        expect(method.parametersAmount).toEqual(4);
    });
});
