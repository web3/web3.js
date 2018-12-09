import {formatters} from 'web3-core-helpers';
import GetTransactionMethod from '../../../../src/methods/transaction/GetTransactionMethod';

// Mocks
jest.mock('formatters');

/**
 * GetTransactionMethod test
 */
describe('GetTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetTransactionMethod({}, {}, formatters);
    });

    it('rpcMethod should return eth_getTransactionByHash', () => {
        expect(method.rpcMethod)
            .toBe('eth_getTransactionByHash');
    });

    it('parametersAmount should return 1', () => {
        expect(method.parametersAmount)
            .toBe(1);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [];

        method.beforeExecution();

        expect(method.parameters[0])
            .toBe(undefined);
    });

    it('afterExecution should map the response', () => {
        formatters.outputTransactionFormatter
            .mockReturnValueOnce({empty: false});

        expect(method.afterExecution({})).toHaveProperty('empty', false);

        expect(formatters.outputTransactionFormatter)
            .toHaveBeenCalledWith({});
    });
});
