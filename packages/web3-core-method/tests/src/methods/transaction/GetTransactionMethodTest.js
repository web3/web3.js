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
        method = new GetTransactionMethod({}, formatters);
    });

    it('static Type property returns "CALL"', () => {
        expect(GetTransactionMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return eth_getTransactionByHash', () => {
        expect(method.rpcMethod).toEqual('eth_getTransactionByHash');
    });

    it('parametersAmount should return 1', () => {
        expect(method.parametersAmount).toEqual(1);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual(undefined);
    });

    it('afterExecution should map the response', () => {
        formatters.outputTransactionFormatter.mockReturnValueOnce({empty: false});

        expect(method.afterExecution({})).toHaveProperty('empty', false);

        expect(formatters.outputTransactionFormatter).toHaveBeenCalledWith({});
    });
});
