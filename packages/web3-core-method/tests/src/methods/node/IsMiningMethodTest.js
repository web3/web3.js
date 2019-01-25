import AbstractCallMethod from '../../../../lib/methods/AbstractCallMethod';
import IsMiningMethod from '../../../../src/methods/node/IsMiningMethod';

/**
 * IsMiningMethod test
 */
describe('IsMiningMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new IsMiningMethod(null, null);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractCallMethod);

        expect(method.rpcMethod).toEqual('eth_mining');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(null);
    });
});
