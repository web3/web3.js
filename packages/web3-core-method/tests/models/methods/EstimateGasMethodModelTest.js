import {formatters} from 'web3-core-helpers';
import * as Utils from 'web3-utils';
import EstimateGasMethodModel from '../../../src/models/methods/EstimateGasMethodModel';

// Mocks
jest.mock('Utils');
jest.mock('formatters');

/**
 * EstimateGasMethodModel test
 */
describe('EstimateGasMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new EstimateGasMethodModel(Utils, formatters);
    });

    it('rpcMethod should return eth_estimateGas', () => {
        expect(model.rpcMethod)
            .toBe('eth_estimateGas');
    });

    it('parametersAmount should return 1', () => {
        expect(model.parametersAmount)
            .toBe(1);
    });

    it('beforeExecution should call the inputCallFormatter', () => {
        model.parameters = [{}];

        formatters.inputCallFormatter
            .mockReturnValueOnce({empty: true});

        model.beforeExecution({});

        expect(model.parameters[0])
            .toHaveProperty('empty', true);

        expect(formatters.inputCallFormatter)
            .toHaveBeenCalledWith({}, {});
    });

    it('afterExecution should call hexToNumber and return the response', () => {
        Utils.hexToNumber
            .mockReturnValueOnce(100);

        expect(model.afterExecution({}))
            .toBe(100);

        expect(Utils.hexToNumber)
            .toHaveBeenCalledWith({});
    });
});
