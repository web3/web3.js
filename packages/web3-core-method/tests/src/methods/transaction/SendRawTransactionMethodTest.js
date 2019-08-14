import AbstractObservedTransactionMethod from '../../../../lib/methods/transaction/AbstractObservedTransactionMethod';
import SendRawTransactionMethod from '../../../../src/methods/transaction/SendRawTransactionMethod';

/**
 * SendRawTransactionMethod test
 */
describe('SendRawTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SendRawTransactionMethod(null, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractObservedTransactionMethod);

        expect(method.rpcMethod).toEqual('eth_sendRawTransaction');
    });

    it('calls afterExecution and returns the expected value', () => {
        expect(method.afterExecution({status: false})).toEqual({status: true});
    });
});
