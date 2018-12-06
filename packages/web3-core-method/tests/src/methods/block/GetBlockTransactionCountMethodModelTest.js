import * as Utils from 'packages/web3-utils/dist/web3-utils.cjs';
import {formatters} from 'packages/web3-core-helpers/dist/web3-core-helpers.cjs';
import GetBlockTransactionCountMethodModel from '../../../../src/models/methods/block/GetBlockTransactionCountMethodModel';

// Mocks
jest.mock('Utils');
jest.mock('formatters');

/**
 * GetBlockTransactionCountMethodModel test
 */
describe('GetBlockTransactionCountMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetBlockTransactionCountMethodModel(Utils, formatters);
    });

    it('rpcMethod should return eth_getTransactionByBlockNumberAndIndex', () => {
        expect(model.rpcMethod)
            .toBe('eth_getTransactionByBlockNumberAndIndex');
    });

    it('parametersAmount should return 1', () => {
        expect(model.parametersAmount)
            .toBe(1);
    });

    it('beforeExecution should call method with block hash as parameter and call inputBlockNumberFormatter', () => {
        model.parameters = ['0x0'];

        formatters.inputBlockNumberFormatter
            .mockReturnValueOnce('0x0');

        model.beforeExecution({});

        expect(model.parameters[0]).toBe('0x0');

        expect(formatters.inputBlockNumberFormatter)
            .toHaveBeenCalledWith('0x0');

        expect(model.rpcMethod).toBe('eth_getTransactionByBlockHashAndIndex');
    });

    it('beforeExecution should call method with block number as parameter and call inputBlockNumberFormatter', () => {
        model.parameters = [100];

        formatters.inputBlockNumberFormatter
            .mockReturnValueOnce('0x0');

        model.beforeExecution({});

        expect(model.parameters[0]).toBe('0x0');

        expect(formatters.inputBlockNumberFormatter)
            .toHaveBeenCalledWith(100);

        expect(model.rpcMethod).toBe('eth_getTransactionByBlockNumberAndIndex');
    });

    it('afterExecution should map the hex string to a number', () => {
        Utils.hexToNumber
            .mockReturnValueOnce(100);

        expect(model.afterExecution('0x0')).toBe(100);

        expect(Utils.hexToNumber)
            .toHaveBeenCalledWith('0x0')
    });
});
