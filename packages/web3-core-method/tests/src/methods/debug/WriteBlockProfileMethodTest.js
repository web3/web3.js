import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import WriteBlockProfileMethod from '../../../../src/methods/debug/WriteBlockProfileMethod';

/**
 * WriteBlockProfileMethod test
 */
describe('WriteBlockProfileMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new WriteBlockProfileMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_writeBlockProfile');

        expect(method.parametersAmount).toEqual(1);
    });
});
