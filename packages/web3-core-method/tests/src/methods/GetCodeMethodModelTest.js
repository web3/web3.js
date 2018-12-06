import {formatters} from 'packages/web3-core-helpers/dist/web3-core-helpers.cjs';
import GetCodeMethodModel from '../../../src/models/methods/GetCodeMethodModel';

// Mocks
jest.mock('formatters');

/**
 * GetCodeMethodModel test
 */
describe('GetCodeMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetCodeMethodModel({}, formatters);
    });

    it('rpcMethod should return eth_getCode', () => {
        expect(model.rpcMethod)
            .toBe('eth_getCode');
    });

    it('parametersAmount should return 2', () => {
        expect(model.parametersAmount)
            .toBe(2);
    });

    it('beforeExecution should call the inputAddressFormatter and inputDefaultBlockNumberFormatter method', () => {
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

    it('afterExecution should just return the response', () => {
        const object = {};

        expect(model.afterExecution(object))
            .toBe(object);
    });
});
