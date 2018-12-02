import {formatters} from 'web3-core-helpers';
import GetPastLogsMethodModel from '../../../src/models/methods/GetPastLogsMethodModel';

// Mocks
jest.mock('formatters');

/**
 * GetPastLogsMethodModel test
 */
describe('GetPastLogsMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetPastLogsMethodModel({}, formatters);
    });

    it('rpcMethod should return eth_getLogs', () => {
        expect(model.rpcMethod)
            .toBe('eth_getLogs');
    });

    it('parametersAmount should return 1', () => {
        expect(model.parametersAmount)
            .toBe(1);
    });

    it('beforeExecution should call the inputAddressFormatter and inputDefaultBlockNumberFormatter method', () => {
        model.parameters = [{}];

        formatters.inputLogFormatter
            .mockReturnValueOnce({empty: true});

        model.beforeExecution({});

        expect(model.parameters[0])
            .toHaveProperty('empty', true);

        expect(formatters.inputLogFormatter)
            .toHaveBeenCalledWith({});
    });

    it('afterExecution should just return the response', () => {
        formatters.outputLogFormatter
            .mockReturnValueOnce({formatted: true});

        expect(model.afterExecution([{}])[0])
            .toHaveProperty('formatted', true);

        expect(formatters.outputLogFormatter)
            .toHaveBeenCalledWith({});
    });
});
