import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import GetBlockUncleCountMethodModel from '../../../../src/models/methods/block/GetBlockUncleCountMethodModel';

// Mocks
jest.mock('Utils');
jest.mock('formatters');

/**
 * GetBlockUncleCountMethodModel test
 */
describe('GetBlockUncleCountMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetBlockUncleCountMethodModel(Utils, formatters);
    });

    it('rpcMethod should return eth_getUncleCountByBlockNumber', () => {
        expect(model.rpcMethod)
            .toBe('eth_getUncleCountByBlockNumber');
    });

    it('parametersAmount should return 1', () => {
        expect(model.parametersAmount)
            .toBe(1);
    });

    it('should call beforeExecution with block hash as parameter and call inputBlockNumberFormatter', () => {
        model.parameters = ['0x0'];

        formatters.inputBlockNumberFormatter
            .mockReturnValueOnce('0x0');

        model.beforeExecution({});

        expect(model.parameters[0]).toBe('0x0');

        expect(formatters.inputBlockNumberFormatter)
            .toHaveBeenCalledWith('0x0');

        expect(model.rpcMethod).toBe('eth_getUncleCountByBlockHash');
    });

    it('should call beforeExecution with block number as parameter and call inputBlockNumberFormatter', () => {
        model.parameters = [100];

        formatters.inputBlockNumberFormatter
            .mockReturnValueOnce('0x0');

        model.beforeExecution({});

        expect(model.parameters[0]).toBe('0x0');

        expect(formatters.inputBlockNumberFormatter)
            .toHaveBeenCalledWith('0x0');

        expect(model.rpcMethod).toBe('eth_getUncleCountByBlockNumber');
    });

    it('afterExecution should map the hex string to a number', () => {
        Utils.hexToNumber
            .mockReturnValueOnce(100);

        expect(model.afterExecution('0x0')).toBe(100);

        expect(Utils.hexToNumber)
            .toHaveBeenCalledWith('0x0');
    });
});
