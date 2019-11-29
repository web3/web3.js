import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import WriteMemProfileMethod from '../../../../src/methods/debug/WriteMemProfileMethod';

/**
 * WriteMemProfileMethod test
 */
describe('WriteMemProfileMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new WriteMemProfileMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_writeMemProfile');

        expect(method.parametersAmount).toEqual(1);
    });
});
