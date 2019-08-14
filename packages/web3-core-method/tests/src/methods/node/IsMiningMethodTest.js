import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import IsMiningMethod from '../../../../src/methods/node/IsMiningMethod';

/**
 * IsMiningMethod test
 */
describe('IsMiningMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new IsMiningMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_mining');

        expect(method.parametersAmount).toEqual(0);
    });
});
