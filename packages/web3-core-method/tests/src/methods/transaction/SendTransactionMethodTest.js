import AbstractObservedTransactionMethod from '../../../../lib/methods/transaction/AbstractObservedTransactionMethod';
import SendTransactionMethod from '../../../../src/methods/transaction/SendTransactionMethod';

/**
 * SendTransactionMethod test
 */
describe('SendTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SendTransactionMethod(null, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractObservedTransactionMethod);

        expect(method.rpcMethod).toEqual('eth_sendTransaction');
    });

    it('beforeExecution should call the inputTransactionFormatter', () => {
        method.parameters = ['tx'];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('0x0');
    });

    it('calls afterExecution and returns the expected value', () => {
        expect(method.afterExecution({status: false})).toEqual({status: true});
    });
});
