import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StopWsMethod from '../../../../src/methods/admin/StopWsMethod';

/**
 * StopWsMethod test
 */
describe('StopWsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StopWsMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_stopWS');

        expect(method.parametersAmount).toEqual(0);
    });
});
