import AbstractObservedTransactionMethod from '../../../../lib/methods/transaction/AbstractObservedTransactionMethod';
import SendTransactionMethod from '../../../../src/methods/transaction/SendTransactionMethod';
import {formatters} from 'web3-core-helpers';

// Mocks
jest.mock('web3-core-helpers');

/**
 * SendRawTransactionMethod test
 */
describe('SendRawTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SendTransactionMethod(null, formatters, null, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractObservedTransactionMethod);

        expect(method.rpcMethod).toEqual('eth_sendTransaction');
    });

    it('beforeExecution should call inputAddressFormatter and inputDefaultBlockNumberFormatter', () => {
        method.parameters = ['tx'];

        formatters.inputTransactionFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('0x0');

        expect(formatters.inputTransactionFormatter).toHaveBeenCalledWith('tx', {});
    });
});
