import SendSignedTransactionMethod from '../../../../src/methods/transaction/SendSignedTransactionMethod';

/**
 * SendSignedTransactionMethod test
 */
describe('SendSignedTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SendSignedTransactionMethod({}, {}, {});
    });

    it('static CommandType property return "SEND_TRANSACTION', () => {
        expect(SendSignedTransactionMethod.CommandType)
            .toBe('SEND_TRANSACTION');
    });

    it('rpcMethod should return eth_sendRawTransaction', () => {
        expect(method.rpcMethod)
            .toBe('eth_sendRawTransaction');
    });

    it('parametersAmount should return 1', () => {
        expect(method.parametersAmount)
            .toBe(1);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [];

        method.beforeExecution();

        expect(method.parameters[0])
            .toBe(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(method.afterExecution('sendSignedTransaction'))
            .toBe('sendSignedTransaction');
    });
});
