import {formatters} from 'web3-core-helpers';
import GetBalanceMethod from '../../../../src/methods/account/GetBalanceMethod';

// Mocks
jest.mock('formatters');

/**
 * GetBalanceMethod test
 */
describe('GetBalanceMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetBalanceMethod({}, {}, formatters);
    });

    it('rpcMethod should return eth_getBalance', () => {
        expect(method.rpcMethod)
            .toBe('eth_getBalance');
    });

    it('parametersAmount should return 2', () => {
        expect(method.parametersAmount)
            .toBe(2);
    });

    it('beforeExecution should call inputAddressFormatter and inputDefaultBlockNumberFormatter', () => {
        method.parameters = ['string', 100];

        formatters.inputAddressFormatter
            .mockReturnValueOnce('0x0');

        formatters.inputDefaultBlockNumberFormatter
            .mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0])
            .toBe('0x0');

        expect(method.parameters[1])
            .toBe('0x0');

        expect(formatters.inputAddressFormatter)
            .toHaveBeenCalledWith('string');

        expect(formatters.inputDefaultBlockNumberFormatter)
            .toHaveBeenCalledWith(100, {});
    });

    it('afterExecution should call outputBigNumberFormatter on the response and return it', () => {
        formatters.outputBigNumberFormatter
            .mockReturnValueOnce({bigNumber: true});

        expect(method.afterExecution({}))
            .toHaveProperty('bigNumber', true);

        expect(formatters.outputBigNumberFormatter)
            .toHaveBeenCalledWith({});
    });
});
