import SignMethod from '../../../src/methods/SignMethod';
import AbstractMethod from '../../../lib/methods/AbstractMethod';

/**
 * SignMethod test
 */
describe('SignMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SignMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.parametersAmount).toEqual(2);

        expect(method.rpcMethod).toEqual('eth_sign');
    });

    it('beforeExecution should call the inputSignFormatter and inputAddressFormatter and swap order of parameters', () => {
        method.parameters = ['string', 'string'];

        method.beforeExecution();

        expect(method.parameters[1]).toEqual('string');

        expect(method.parameters[0]).toEqual('0x0');
    });

    it('afterExecution should just return the response', () => {
        expect(method.afterExecution({})).toEqual({});
    });
});
