import {formatters} from 'web3-core-helpers';
import GetGasPriceMethod from '../../../../src/methods/node/GetGasPriceMethod';

// Mocks
jest.mock('formatters');

/**
 * GetGasPriceMethod test
 */
describe('GetGasPriceMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetGasPriceMethod({}, formatters);
    });

    it('static Type property returns "CALL"', () => {
        expect(GetGasPriceMethod.Type)
            .toBe('CALL');
    });

    it('rpcMethod should return eth_gasPrice', () => {
        expect(method.rpcMethod).toBe('eth_gasPrice');
    });

    it('parametersAmount should return 0', () => {
        expect(method.parametersAmount).toBe(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [];
        method.beforeExecution();

        expect(method.parameters[0]).toBe(undefined);
    });

    it('afterExecution should map the response', () => {
        formatters.outputBigNumberFormatter
            .mockReturnValueOnce({bigNumber: true});

        expect(method.afterExecution('1000')).toHaveProperty('bigNumber', true);

        expect(formatters.outputBigNumberFormatter)
            .toHaveBeenCalledWith('1000');
    });
});
