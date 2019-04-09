import {formatters} from 'conflux-web-core-helpers';
import SignMethod from '../../../src/methods/SignMethod';
import AbstractMethod from '../../../lib/methods/AbstractMethod';

// Mocks
jest.mock('conflux-web-core-helpers');

/**
 * SignMethod test
 */
describe('SignMethodTest', () => {
    let method, moduleInstanceMock;

    beforeEach(() => {
        method = new SignMethod({}, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.parametersAmount).toEqual(2);

        expect(method.rpcMethod).toEqual('eth_sign');
    });

    it('beforeExecution should call the inputSignFormatter and inputAddressFormatter and swap order of parameters', () => {
        method.parameters = ['string', 'string'];

        formatters.inputSignFormatter.mockReturnValueOnce('string');

        formatters.inputAddressFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution(moduleInstanceMock);

        expect(method.parameters[1]).toEqual('string');

        expect(method.parameters[0]).toEqual('0x0');

        expect(formatters.inputSignFormatter).toHaveBeenCalledWith('string');

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('string');
    });

    it('afterExecution should just return the response', () => {
        expect(method.afterExecution({})).toEqual({});
    });
});
