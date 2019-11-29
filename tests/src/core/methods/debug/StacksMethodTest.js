import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StacksMethod from '../../../../src/methods/debug/StacksMethod';

/**
 * StacksMethod test
 */
describe('StacksMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StacksMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_stacks');

        expect(method.parametersAmount).toEqual(0);
    });
});
