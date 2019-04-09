import {formatters} from 'conflux-web-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import SignTransactionMethod from '../../../../src/methods/transaction/SignTransactionMethod';

// Mocks
jest.mock('conflux-web-core-helpers');

/**
 * SignTransactionMethod test
 */
describe('SignTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SignTransactionMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

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
