import {formatters} from 'packages/web3-core-helpers/dist/web3-core-helpers.cjs';
import GetGasPriceMethodModel from '../../../../src/models/methods/node/GetGasPriceMethodModel';

// Mocks
jest.mock('formatters');

/**
 * GetGasPriceMethodModel test
 */
describe('GetGasPriceMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetGasPriceMethodModel({}, formatters);
    });

    it('rpcMethod should return eth_gasPrice', () => {
        expect(model.rpcMethod).toBe('eth_gasPrice');
    });

    it('parametersAmount should return 0', () => {
        expect(model.parametersAmount).toBe(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).toBe(undefined);
    });

    it('afterExecution should map the response', () => {
        formatters.outputBigNumberFormatter
            .mockReturnValueOnce({bigNumber: true});

        expect(model.afterExecution('1000')).toHaveProperty('bigNumber', true);

        expect(formatters.outputBigNumberFormatter)
            .toHaveBeenCalledWith('1000');
    });
});
