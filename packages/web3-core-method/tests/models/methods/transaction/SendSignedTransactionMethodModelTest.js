import SendSignedTransactionMethodModel from '../../../../src/models/methods/transaction/SendSignedTransactionMethodModel';

/**
 * SendSignedTransactionMethodModel test
 */
describe('SendSignedTransactionMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new SendSignedTransactionMethodModel({}, {});
    });

    it('rpcMethod should return eth_sendRawTransaction', () => {
        expect(model.rpcMethod).to.equal('eth_sendRawTransaction');
    });

    it('parametersAmount should return 1', () => {
        expect(model.parametersAmount).to.equal(1);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];

        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('sendSignedTransaction')).equal('sendSignedTransaction');
    });
});
