import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../lib/methods/AbstractMethod';
import CallMethod from '../../../src/methods/CallMethod';

// Mocks
jest.mock('web3-core-helpers');

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

        expect(method.rpcMethod).toEqual('eth_call');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });

    it('beforeExecution should call inputCallFormatter and inputDefaultBlockNumberFormatter', () => {
        method.parameters = [{}, 100];

        formatters.inputCallFormatter.mockReturnValueOnce({empty: true});

        formatters.inputDefaultBlockNumberFormatter.mockReturnValueOnce({empty: true});

        method.beforeExecution({});

        expect(method.parameters[0]).toHaveProperty('empty', true);

        expect(method.parameters[1]).toEqual({empty: true});

        expect(formatters.inputDefaultBlockNumberFormatter).toHaveBeenCalledWith(100, {});

        expect(formatters.inputCallFormatter).toHaveBeenCalledWith({}, {});
    });

    it('calls beforeExecution with a callback instead of the optional paramter and it calls the inputCallFormatter and inputDefaultBlockNumberFormatter', () => {
        const callback = jest.fn();
        method.parameters = [{}, callback];

        formatters.inputCallFormatter.mockReturnValueOnce({empty: true});

        formatters.inputDefaultBlockNumberFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({defaultBlock: 'latest'});

        expect(method.callback).toEqual(callback);

        expect(method.parameters[0]).toEqual({empty: true});

        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputCallFormatter).toHaveBeenCalledWith({}, {defaultBlock: 'latest'});

        expect(formatters.inputDefaultBlockNumberFormatter).toHaveBeenCalledWith('latest', {defaultBlock: 'latest'});
    });
});
