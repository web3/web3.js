import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetProofMethod from '../../../../src/methods/node/GetProofMethod';

/**
 * GetProofMethod test
 */
describe('GetProofMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetProofMethod(null, null, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_getProof');

        expect(method.parametersAmount).toEqual(3);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(null);
    });
});
