import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import VmoduleMethod from '../../../../src/methods/debug/VmoduleMethod';

/**
 * VmoduleMethod test
 */
describe('VmoduleMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new VmoduleMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_vmodule');

        expect(method.parametersAmount).toEqual(1);
    });
});
