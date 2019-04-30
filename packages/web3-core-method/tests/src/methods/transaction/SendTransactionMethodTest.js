import AbstractObservedTransactionMethod from '../../../../lib/methods/transaction/AbstractObservedTransactionMethod';
import SendTransactionMethod from '../../../../src/methods/transaction/SendTransactionMethod';
import {formatters} from 'web3-core-helpers';

// Mocks
jest.mock('web3-core-helpers');

/**
 * SendTransactionMethod test
 */
describe('SendTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SendTransactionMethod(null, formatters, null, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractObservedTransactionMethod);

        expect(method.rpcMethod).toEqual('eth_sendTransaction');
    });

    it('beforeExecution should call the inputTransactionFormatter', () => {
        method.parameters = ['tx'];

        formatters.inputTransactionFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('0x0');

        expect(formatters.inputTransactionFormatter).toHaveBeenCalledWith('tx', {});
    });

    it('calls afterExecution and returns the expected value', () => {
        formatters.outputTransactionFormatter.mockReturnValueOnce({status: true});

        expect(method.afterExecution({status: false})).toEqual({status: true});

        expect(formatters.outputTransactionFormatter).toHaveBeenCalledWith({status: false});
    });
});
