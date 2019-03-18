import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetTransactionMethod from '../../../../src/methods/transaction/GetTransactionMethod';

// Mocks
jest.mock('formatters');

/**
 * GetTransactionMethod test
 */
describe('GetTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetTransactionMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_getTransactionByHash');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });

    it('afterExecution should map the response', () => {
        formatters.outputTransactionFormatter.mockReturnValueOnce({empty: false});

        expect(method.afterExecution({})).toHaveProperty('empty', false);

        expect(formatters.outputTransactionFormatter).toHaveBeenCalledWith({});
    });
});
