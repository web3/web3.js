import SendRawTransactionMethod from '../../../../src/methods/transaction/SendRawTransactionMethod';

/**
 * SendRawTransactionMethod test
 */
describe('SendRawTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        // TODO: Add sendMethodCommand test cases and dependencies
        method = new SendRawTransactionMethod({}, {});
    });

    it('static Type property returns "SEND_TRANSACTION', () => {
        expect(SendRawTransactionMethod.Type).toEqual('SEND');
    });

    it('rpcMethod should return eth_sendRawTransaction', () => {
        expect(method.rpcMethod).toEqual('eth_sendRawTransaction');
    });

    it('parametersAmount should return 1', () => {
        expect(method.parametersAmount).toEqual(1);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(method.afterExecution('sendSignedTransaction')).toEqual('sendSignedTransaction');
    });
});
