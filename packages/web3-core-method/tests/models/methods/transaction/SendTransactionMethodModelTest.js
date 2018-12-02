import {formatters} from 'web3-core-helpers';
import SendTransactionMethodModel from '../../../../src/models/methods/transaction/SendTransactionMethodModel';

// Mocks
jest.mock('formatters');

/**
 * SendTransactionMethodModel test
 */
describe('SendTransactionMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new SendTransactionMethodModel({}, formatters, {accounts: true});
    });

    it('accounts is set', () => {
        expect(model.accounts)
            .toHaveProperty('accounts', true);
    });

    it('rpcMethod should return eth_sendTransaction', () => {
        expect(model.rpcMethod)
            .toBe('eth_sendTransaction');
    });

    it('parametersAmount should return 1', () => {
        expect(model.parametersAmount)
            .toBe(1);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [{}];

        formatters.inputTransactionFormatter
            .mockReturnValueOnce({empty: false});

        model.beforeExecution({});

        expect(model.parameters[0])
            .toHaveProperty('empty', false);

        expect(formatters.inputTransactionFormatter)
            .toHaveBeenCalledWith({}, {});
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('sendTransaction'))
            .toBe('sendTransaction');
    });
});
