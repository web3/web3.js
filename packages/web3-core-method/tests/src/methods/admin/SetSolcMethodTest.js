import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import SetSolcMethod from '../../../../src/methods/admin/SetSolcMethod';

/**
 * SetSolcMethod test
 */
describe('SetSolcMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SetSolcMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_setSolc');

        expect(method.parametersAmount).toEqual(1);
    });
});
