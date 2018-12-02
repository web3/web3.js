import {formatters} from 'web3-core-helpers';
import SignTransactionMethodModel from '../../../../src/models/methods/transaction/SignTransactionMethodModel';

// Mocks
jest.mock('formatters');

/**
 * SendTransactionMethodModel test
 */
describe('SendTransactionMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new SignTransactionMethodModel({}, formatters);
    });

    it('rpcMethod should return eth_signTransaction', () => {
        expect(model.rpcMethod)
            .toBe('eth_signTransaction');
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
