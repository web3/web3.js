import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import SubmitWorkMethod from '../../../../src/methods/node/SubmitWorkMethod';

/**
 * SubmitWorkMethod test
 */
describe('SubmitWorkMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SubmitWorkMethod(null, null, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_submitWork');

        expect(method.parametersAmount).toEqual(3);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(null);
    });
});
