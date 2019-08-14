import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StartRpcMethod from '../../../../src/methods/admin/StartRpcMethod';

/**
 * StartRpcMethod test
 */
describe('StartRpcMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StartRpcMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_startRPC');

        expect(method.parametersAmount).toEqual(4);
    });

    it('calls beforeExecution and calls utils.numberToHex', () => {
        method.parameters = [0, 1];

        method.beforeExecution();

        expect(method.parameters[1]).toEqual('0x1');
    });
});
