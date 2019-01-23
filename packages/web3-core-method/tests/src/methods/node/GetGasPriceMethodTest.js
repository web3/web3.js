import {formatters} from 'web3-core-helpers';
import AbstractCallMethod from '../../../../lib/methods/AbstractCallMethod';
import GetGasPriceMethod from '../../../../src/methods/node/GetGasPriceMethod';

// Mocks
jest.mock('formatters');

/**
 * GetGasPriceMethod test
 */
describe('GetGasPriceMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetGasPriceMethod(null, formatters);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractCallMethod);

        expect(method.rpcMethod).toEqual('eth_gasPrice');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });

    it('afterExecution should map the response', () => {
        formatters.outputBigNumberFormatter.mockReturnValueOnce({bigNumber: true});

        expect(method.afterExecution('1000')).toHaveProperty('bigNumber', true);

        expect(formatters.outputBigNumberFormatter).toHaveBeenCalledWith('1000');
    });
});
