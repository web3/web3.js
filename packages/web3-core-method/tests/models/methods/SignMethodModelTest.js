import {formatters} from 'web3-core-helpers';
import SignMethodModel from '../../../src/models/methods/SignMethod';

// Mocks
jest.mock('formatters');

/**
 * GetStorageAtMethod test
 */
describe('SignMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new SignMethodModel({}, formatters, {test: true});
    });

    it('accounts should be defined', () => {
        expect(model.accounts.test)
            .toBeTruthy();
    });

    it('rpcMethod should return eth_sign', () => {
        expect(model.rpcMethod)
            .toBe('eth_sign');
    });

    it('parametersAmount should return 2', () => {
        expect(model.parametersAmount)
            .toBe(2);
    });

    it('beforeExecution should call the inputSignFormatter and inputAddressFormatter', () => {
        model.parameters = ['string', 'string'];

        formatters.inputSignFormatter
            .mockReturnValueOnce('string');

        formatters.inputAddressFormatter
            .mockReturnValueOnce('0x0');

        model.beforeExecution({});

        expect(model.parameters[0])
            .toBe('string');

        expect(model.parameters[1])
            .toBe('0x0');

        expect(formatters.inputSignFormatter)
            .toHaveBeenCalledWith('string');

        expect(formatters.inputAddressFormatter)
            .toHaveBeenCalledWith('string');
    });

    it('afterExecution should just return the response', () => {
        const object = {};

        expect(model.afterExecution(object))
            .toBe(object);
    });
});
