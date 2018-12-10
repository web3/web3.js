import {formatters} from 'web3-core-helpers';
import SignMethod from '../../../src/methods/SignMethod';

// Mocks
jest.mock('formatters');

/**
 * SignMethod test
 */
describe('SignMethodTest', () => {
    let method;

    beforeEach(() => {
        // TODO: Add CallMethodCommand test cases and dependencies
        method = new SignMethod({}, {}, formatters, {test: true});
    });

    it('static Type property returns "CALL"', () => {
        expect(SignMethod.Type)
            .toBe('CALL');
    });

    it('accounts should be defined', () => {
        expect(method.accounts.test)
            .toBeTruthy();
    });

    it('rpcMethod should return eth_sign', () => {
        expect(method.rpcMethod)
            .toBe('eth_sign');
    });

    it('parametersAmount should return 2', () => {
        expect(method.parametersAmount)
            .toBe(2);
    });

    it('beforeExecution should call the inputSignFormatter and inputAddressFormatter', () => {
        method.parameters = ['string', 'string'];

        formatters.inputSignFormatter
            .mockReturnValueOnce('string');

        formatters.inputAddressFormatter
            .mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0])
            .toBe('string');

        expect(method.parameters[1])
            .toBe('0x0');

        expect(formatters.inputSignFormatter)
            .toHaveBeenCalledWith('string');

        expect(formatters.inputAddressFormatter)
            .toHaveBeenCalledWith('string');
    });

    it('afterExecution should just return the response', () => {
        const object = {};

        expect(method.afterExecution(object))
            .toBe(object);
    });
});
