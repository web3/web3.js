import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetWorkMethod from '../../../../src/methods/node/GetWorkMethod';

/**
 * GetWorkMethod test
 */
describe('GetWorkMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetWorkMethod(null, null, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_getWork');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(null);
    });
});
