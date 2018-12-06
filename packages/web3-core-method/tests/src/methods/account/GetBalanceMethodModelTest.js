import {formatters} from 'packages/web3-core-helpers/dist/web3-core-helpers.cjs';
import GetBalanceMethodModel from '../../../../src/models/methods/account/GetBalanceMethodModel';

// Mocks
jest.mock('formatters');

/**
 * GetBalanceMethodModel test
 */
describe('GetBalanceMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetBalanceMethodModel({}, formatters);
    });

    it('rpcMethod should return eth_getBalance', () => {
        expect(model.rpcMethod)
            .toBe('eth_getBalance');
    });

    it('parametersAmount should return 2', () => {
        expect(model.parametersAmount)
            .toBe(2);
    });

    it('beforeExecution should call inputAddressFormatter and inputDefaultBlockNumberFormatter', () => {
        model.parameters = ['string', 100];

        formatters.inputAddressFormatter
            .mockReturnValueOnce('0x0');

        formatters.inputDefaultBlockNumberFormatter
            .mockReturnValueOnce('0x0');

        model.beforeExecution({});

        expect(model.parameters[0])
            .toBe('0x0');

        expect(model.parameters[1])
            .toBe('0x0');

        expect(formatters.inputAddressFormatter)
            .toHaveBeenCalledWith('string');

        expect(formatters.inputDefaultBlockNumberFormatter)
            .toHaveBeenCalledWith(100, {});
    });

    it('afterExecution should call outputBigNumberFormatter on the response and return it', () => {
        formatters.outputBigNumberFormatter
            .mockReturnValueOnce({bigNumber: true});

        expect(model.afterExecution({}))
            .toHaveProperty('bigNumber', true);

        expect(formatters.outputBigNumberFormatter)
            .toHaveBeenCalledWith({});
    });
});
