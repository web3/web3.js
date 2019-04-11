import {formatters} from 'conflux-web-core-helpers';
import AbstractMethod from '../../../lib/methods/AbstractMethod';
import GetCodeMethod from '../../../src/methods/GetCodeMethod';

// Mocks
jest.mock('conflux-web-core-helpers');

/**
 * GetCodeMethod test
 */
describe('GetCodeMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetCodeMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_getCode');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });

    it('beforeExecution should call the inputAddressFormatter and inputDefaultEpochNumberFormatter method', () => {
        method.parameters = ['string', 100];

        formatters.inputAddressFormatter.mockReturnValueOnce('0x0');

        formatters.inputDefaultEpochNumberFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('string');

        expect(formatters.inputDefaultEpochNumberFormatter).toHaveBeenCalledWith(100, {});
    });

    it('calls beforeExecution without a callback instead of the optional parameter', () => {
        const callback = jest.fn();
        method.parameters = ['string', callback];

        formatters.inputAddressFormatter.mockReturnValueOnce('0x0');

        formatters.inputDefaultEpochNumberFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({defaultEpoch: 'latest_mined'});

        expect(method.callback).toEqual(callback);

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('string');

        expect(formatters.inputDefaultEpochNumberFormatter).toHaveBeenCalledWith('latest_mined', {
            defaultEpoch: 'latest_mined'
        });
    });
});
