import {formatters} from 'packages/web3-core-helpers/dist/web3-core-helpers.cjs';
import GetTransactionMethodModel from '../../../../src/models/methods/transaction/GetTransactionMethodModel';

// Mocks
jest.mock('formatters');

/**
 * GetTransactionMethodModel test
 */
describe('GetTransactionMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetTransactionMethodModel({}, formatters);
    });

    it('rpcMethod should return eth_getTransactionByHash', () => {
        expect(model.rpcMethod)
            .toBe('eth_getTransactionByHash');
    });

    it('parametersAmount should return 1', () => {
        expect(model.parametersAmount)
            .toBe(1);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];

        model.beforeExecution();

        expect(model.parameters[0])
            .toBe(undefined);
    });

    it('afterExecution should map the response', () => {
        formatters.outputTransactionFormatter
            .mockReturnValueOnce({empty: false});

        expect(model.afterExecution({})).toHaveProperty('empty', false);

        expect(formatters.outputTransactionFormatter)
            .toHaveBeenCalledWith({});
    });
});
