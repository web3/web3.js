import {formatters} from 'web3-core-helpers';
import GetPastLogsMethod from '../../../src/methods/GetPastLogsMethod';

// Mocks
jest.mock('formatters');

/**
 * GetPastLogsMethod test
 */
describe('GetPastLogsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetPastLogsMethod({}, formatters);
    });

    it('static Type property returns "CALL"', () => {
        expect(GetPastLogsMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return eth_getLogs', () => {
        expect(method.rpcMethod).toEqual('eth_getLogs');
    });

    it('parametersAmount should return 1', () => {
        expect(method.parametersAmount).toEqual(1);
    });

    it('beforeExecution should call the inputAddressFormatter and inputDefaultBlockNumberFormatter method', () => {
        method.parameters = [{}];

        formatters.inputLogFormatter.mockReturnValueOnce({empty: true});

        method.beforeExecution({});

        expect(method.parameters[0]).toHaveProperty('empty', true);

        expect(formatters.inputLogFormatter).toHaveBeenCalledWith({});
    });

    it('afterExecution should just return the response', () => {
        formatters.outputLogFormatter.mockReturnValueOnce({formatted: true});

        expect(method.afterExecution([{}])[0]).toHaveProperty('formatted', true);

        expect(formatters.outputLogFormatter).toHaveBeenCalledWith({});
    });
});
