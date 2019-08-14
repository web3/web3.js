import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetBalanceMethod from '../../../../src/methods/account/GetBalanceMethod';

/**
 * GetBalanceMethod test
 */
describe('GetBalanceMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetBalanceMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_getBalance');

        expect(method.parametersAmount).toEqual(2);
    });

    it('beforeExecution should call inputAddressFormatter and inputDefaultBlockNumberFormatter', () => {
        method.parameters = ['string', 100];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toEqual('0x0');
    });

    it('calls beforeExecution with a callback instead of the optional paramter and it calls the inputAddressFormatter and inputDefaultBlockNumberFormatter', () => {
        const callback = jest.fn();
        method.parameters = ['string', callback];

        method.beforeExecution();

        expect(method.callback).toEqual(callback);

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toEqual('0x0');
    });

    it('afterExecution should call outputBigNumberFormatter on the response and return it', () => {
        expect(method.afterExecution('response')).toHaveProperty('bigNumber', true);
    });
});
