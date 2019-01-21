import {formatters} from 'web3-core-helpers';
import GetCodeMethod from '../../../src/methods/GetCodeMethod';

// Mocks
jest.mock('formatters');

/**
 * GetCodeMethod test
 */
describe('GetCodeMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetCodeMethod({}, formatters);
    });

    it('static Type property returns "CALL"', () => {
        expect(GetCodeMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return eth_getCode', () => {
        expect(method.rpcMethod).toEqual('eth_getCode');
    });

    it('parametersAmount should return 2', () => {
        expect(method.parametersAmount).toEqual(2);
    });

    it('beforeExecution should call the inputAddressFormatter and inputDefaultBlockNumberFormatter method', () => {
        method.parameters = ['string', 100];

        formatters.inputAddressFormatter.mockReturnValueOnce('0x0');

        formatters.inputDefaultBlockNumberFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('string');

        expect(formatters.inputDefaultBlockNumberFormatter).toHaveBeenCalledWith(100, {});
    });

    it('afterExecution should just return the response', () => {
        const object = {};

        expect(method.afterExecution(object)).toEqual(object);
    });
});
