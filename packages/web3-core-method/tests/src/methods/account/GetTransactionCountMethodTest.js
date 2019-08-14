import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetTransactionCountMethod from '../../../../src/methods/account/GetTransactionCountMethod';

/**
 * GetTransactionCountMethod test
 */
describe('GetTransactionCountMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetTransactionCountMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_getTransactionCount');

        expect(method.parametersAmount).toEqual(2);
    });

    it('beforeExecution should call inputAddressFormatter and inputDefaultBlockNumberFormatter', () => {
        method.parameters = ['string', 100];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toEqual('0x0');
    });

    it('calls beforeExecution with a callback instead of a optional parameter and calls the inputAddressFormatter and inputDefaultBlockNumberFormatter', () => {
        const callback = jest.fn();
        method.parameters = ['string', callback];

        method.beforeExecution();

        expect(method.callback).toEqual(callback);

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toEqual('0x0');
    });

    it('afterExecution should call hexToNumber on the response and return it', () => {
        expect(method.afterExecution('0x0')).toEqual(100);
    });
});
