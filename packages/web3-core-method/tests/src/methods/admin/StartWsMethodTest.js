import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StartWsMethod from '../../../../src/methods/admin/StartWsMethod';

/**
 * StartWsMethod test
 */
describe('StartWsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StartWsMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_startWS');

        expect(method.parametersAmount).toEqual(4);
    });
});
