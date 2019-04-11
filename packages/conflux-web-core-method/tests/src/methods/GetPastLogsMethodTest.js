import {formatters} from 'conflux-web-core-helpers';
import AbstractMethod from '../../../lib/methods/AbstractMethod';
import GetPastLogsMethod from '../../../src/methods/GetPastLogsMethod';

// Mocks
jest.mock('conflux-web-core-helpers');

/**
 * GetPastLogsMethod test
 */
describe('GetPastLogsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetPastLogsMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_getLogs');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });

    it('beforeExecution should call the inputAddressFormatter and inputDefaultEpochNumberFormatter method', () => {
        method.parameters = [{}];

        formatters.inputLogFormatter.mockReturnValueOnce({empty: true});

        method.beforeExecution({});

        expect(method.parameters[0]).toHaveProperty('empty', true);

        expect(formatters.inputLogFormatter).toHaveBeenCalledWith({});
    });

    it('afterExecution should call the outputLogFormatter and return the response', () => {
        formatters.outputLogFormatter.mockReturnValueOnce({formatted: true});

        expect(method.afterExecution([{}])[0]).toHaveProperty('formatted', true);

        expect(formatters.outputLogFormatter).toHaveBeenCalledWith({});
    });
});
