import AbstractSendMethod from '../../../../lib/methods/AbstractSendMethod';
import SendRawTransactionMethod from '../../../../src/methods/transaction/SendRawTransactionMethod';

/**
 * SendRawTransactionMethod test
 */
describe('SendRawTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SendRawTransactionMethod(null, null, null);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractSendMethod);

        expect(method.rpcMethod).toEqual('eth_sendRawTransaction');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(null);

        expect(method.transactionConfirmationWorkflow).toEqual(null);
    });
});
