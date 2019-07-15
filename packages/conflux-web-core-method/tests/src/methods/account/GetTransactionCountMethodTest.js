import {formatters} from 'conflux-web-core-helpers';
import * as Utils from 'conflux-web-utils';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetTransactionCountMethod from '../../../../src/methods/account/GetTransactionCountMethod';

// Mocks
jest.mock('conflux-web-core-helpers');
jest.mock('conflux-web-utils');

/**
 * GetTransactionCountMethod test
 */
describe('GetTransactionCountMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetTransactionCountMethod(Utils, formatters);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('cfx_getTransactionCount');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual(Utils);

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

    it('calls beforeExecution with a callback instead of a optional parameter and calls the inputAddressFormatter and inputDefaultEpochNumberFormatter', () => {
        const callback = jest.fn();
        method.parameters = ['string', callback];

        formatters.inputAddressFormatter.mockReturnValueOnce('0x0');

        formatters.inputDefaultEpochNumberFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({defaultEpoch: 'latest_state'});

        expect(method.callback).toEqual(callback);

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('string');

        expect(formatters.inputDefaultEpochNumberFormatter).toHaveBeenCalledWith('latest_state', {
            defaultEpoch: 'latest_state'
        });
    });

    it('afterExecution should call hexToNumber on the response and return it', () => {
        Utils.hexToNumber.mockReturnValueOnce(100);

        expect(method.afterExecution('0x0')).toEqual(100);

        expect(Utils.hexToNumber).toHaveBeenCalledWith('0x0');
    });
});
