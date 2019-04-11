import {formatters} from 'conflux-web-core-helpers';
import AbstractMethod from '../../../lib/methods/AbstractMethod';
import CallMethod from '../../../src/methods/CallMethod';

// Mocks
jest.mock('conflux-web-core-helpers');

/**
 * CallMethod test
 */
describe('CallMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new CallMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('cfx_call');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });

    it('beforeExecution should call inputCallFormatter and inputDefaultEpochNumberFormatter', () => {
        method.parameters = [{}, 100];

        formatters.inputCallFormatter.mockReturnValueOnce({empty: true});

        formatters.inputDefaultEpochNumberFormatter.mockReturnValueOnce({empty: true});

        method.beforeExecution({});

        expect(method.parameters[0]).toHaveProperty('empty', true);

        expect(method.parameters[1]).toEqual({empty: true});

        expect(formatters.inputDefaultEpochNumberFormatter).toHaveBeenCalledWith(100, {});

        expect(formatters.inputCallFormatter).toHaveBeenCalledWith({}, {});
    });

    it('calls beforeExecution with a callback instead of the optional paramter and it calls the inputCallFormatter and inputDefaultEpochNumberFormatter', () => {
        const callback = jest.fn();
        method.parameters = [{}, callback];

        formatters.inputCallFormatter.mockReturnValueOnce({empty: true});

        formatters.inputDefaultEpochNumberFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({defaultEpoch: 'latest'});

        expect(method.callback).toEqual(callback);

        expect(method.parameters[0]).toEqual({empty: true});

        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputCallFormatter).toHaveBeenCalledWith({}, {defaultEpoch: 'latest'});

        expect(formatters.inputDefaultEpochNumberFormatter).toHaveBeenCalledWith('latest', {defaultEpoch: 'latest'});
    });
});
