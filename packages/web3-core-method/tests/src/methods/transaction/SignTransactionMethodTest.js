import {formatters} from 'web3-core-helpers';
import AbstractCallMethod from '../../../../lib/methods/AbstractCallMethod';
import SignTransactionMethod from '../../../../src/methods/transaction/SignTransactionMethod';

// Mocks
jest.mock('formatters');

/**
 * SignTransactionMethod test
 */
describe('SignTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SignTransactionMethod(null, formatters);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractCallMethod);

        expect(method.rpcMethod).toEqual('eth_signTransaction');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });

    it('beforeExecution should execute the inputTransactionFormatter', () => {
        method.parameters = [{}];

        formatters.inputTransactionFormatter.mockReturnValueOnce({empty: false});

        method.beforeExecution({});

        expect(method.parameters[0]).toHaveProperty('empty', false);

        expect(formatters.inputTransactionFormatter).toHaveBeenCalledWith({}, {});
    });
});
