import AbstractMethod from '../../../lib/methods/AbstractMethod';
import GetCodeMethod from '../../../src/methods/GetCodeMethod';

/**
 * GetCodeMethod test
 */
describe('GetCodeMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetCodeMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_getCode');

        expect(method.parametersAmount).toEqual(2);
    });

    it('beforeExecution should call the inputAddressFormatter and inputDefaultBlockNumberFormatter method', () => {
        method.parameters = ['string', 100];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toEqual('0x0');
    });

    it('calls beforeExecution without a callback instead of the optional parameter', () => {
        const callback = jest.fn();
        method.parameters = ['string', callback];

        method.beforeExecution();

        expect(method.callback).toEqual(callback);

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toEqual('0x0');
    });
});
