import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import GetBlockTransactionCountMethod from '../../../../src/methods/block/GetBlockTransactionCountMethod';

// Mocks
jest.mock('Utils');
jest.mock('formatters');

/**
 * GetBlockTransactionCountMethod test
 */
describe('GetBlockTransactionCountMethod', () => {
    let method;

    beforeEach(() => {
        method = new GetBlockTransactionCountMethod(Utils, formatters);
    });

    it('static Type property returns "CALL"', () => {
        expect(GetBlockTransactionCountMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return eth_getTransactionByBlockNumberAndIndex', () => {
        expect(method.rpcMethod).toEqual('eth_getTransactionByBlockNumberAndIndex');
    });

    it('parametersAmount should return 1', () => {
        expect(method.parametersAmount).toEqual(1);
    });

    it('beforeExecution should call method with block hash as parameter and call inputBlockNumberFormatter', () => {
        method.parameters = ['0x0'];

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('0x0');

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith('0x0');

        expect(method.rpcMethod).toEqual('eth_getTransactionByBlockHashAndIndex');
    });

    it('beforeExecution should call method with block number as parameter and call inputBlockNumberFormatter', () => {
        method.parameters = [100];

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('0x0');

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith(100);

        expect(method.rpcMethod).toEqual('eth_getTransactionByBlockNumberAndIndex');
    });

    it('afterExecution should map the hex string to a number', () => {
        Utils.hexToNumber.mockReturnValueOnce(100);

        expect(method.afterExecution('0x0')).toEqual(100);

        expect(Utils.hexToNumber).toHaveBeenCalledWith('0x0');
    });
});
