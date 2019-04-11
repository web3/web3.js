import {formatters} from 'conflux-web-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetBalanceMethod from '../../../../src/methods/account/GetBalanceMethod';

// Mocks
jest.mock('conflux-web-core-helpers');

/**
 * GetBalanceMethod test
 */
describe('GetBalanceMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetBalanceMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_getBalance');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });

    it('beforeExecution should call inputAddressFormatter and inputDefaultEpochNumberFormatter', () => {
        method.parameters = ['string', 100];

        formatters.inputAddressFormatter.mockReturnValueOnce('0x0');

        formatters.inputDefaultEpochNumberFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('string');

        expect(formatters.inputDefaultEpochNumberFormatter).toHaveBeenCalledWith(100, {});
    });

    it('calls beforeExecution with a callback instead of the optional paramter and it calls the inputAddressFormatter and inputDefaultEpochNumberFormatter', () => {
        const callback = jest.fn();
        method.parameters = ['string', callback];

        formatters.inputAddressFormatter.mockReturnValueOnce('0x0');

        formatters.inputDefaultEpochNumberFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({defaultEpoch: 'latest'});

        expect(method.callback).toEqual(callback);

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('string');

        expect(formatters.inputDefaultEpochNumberFormatter).toHaveBeenCalledWith('latest', {defaultEpoch: 'latest'});
    });

    it('afterExecution should call outputBigNumberFormatter on the response and return it', () => {
        formatters.outputBigNumberFormatter.mockReturnValueOnce({bigNumber: true});

        expect(method.afterExecution('response')).toHaveProperty('bigNumber', true);

        expect(formatters.outputBigNumberFormatter).toHaveBeenCalledWith('response');
    });
});
