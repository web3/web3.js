import {formatters} from 'web3-core-helpers';
import SendTransactionMethod from '../../../../src/methods/transaction/SendTransactionMethod';

// Mocks
jest.mock('formatters');

/**
 * SendTransactionMethod test
 */
describe('SendTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        // TODO: Add SendTransactionCommand test cases and dependencies
        method = new SendTransactionMethod({}, formatters, {accounts: true});
    });

    it('static Type property returns "SEND_TRANSACTION', () => {
        expect(SendTransactionMethod.Type)
            .toBe('SEND');
    });

    it('accounts is set', () => {
        expect(method.accounts)
            .toHaveProperty('accounts', true);
    });

    it('rpcMethod should return eth_sendTransaction', () => {
        expect(method.rpcMethod)
            .toBe('eth_sendTransaction');
    });

    it('parametersAmount should return 1', () => {
        expect(method.parametersAmount)
            .toBe(1);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [{}];

        formatters.inputTransactionFormatter
            .mockReturnValueOnce({empty: false});

        method.beforeExecution({});

        expect(method.parameters[0])
            .toHaveProperty('empty', false);

        expect(formatters.inputTransactionFormatter)
            .toHaveBeenCalledWith({}, {});
    });

    it('afterExecution should just return the response', () => {
        expect(method.afterExecution('sendTransaction'))
            .toBe('sendTransaction');
    });
});
