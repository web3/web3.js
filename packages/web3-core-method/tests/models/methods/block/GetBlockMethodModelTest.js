import {formatters} from 'web3-core-helpers';
import GetBlockMethodModel from '../../../../src/models/methods/block/GetBlockMethodModel';

// Mocks
jest.mock('formatters');

/**
 * GetBlockMethodModel test
 */
describe('GetBlockMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetBlockMethodModel({}, formatters);
    });

    it('rpcMethod should return eth_getBlockByNumber', () => {
        expect(model.rpcMethod).toBe('eth_getBlockByNumber');
    });

    it('parametersAmount should return 2', () => {
        expect(model.parametersAmount).toBe(2);
    });

    it('should call beforeExecution with block hash as parameter and call inputBlockNumberFormatter', () => {
        model.parameters = ['0x0', true];

        formatters.inputBlockNumberFormatter
            .mockReturnValueOnce('0x0');

        model.beforeExecution({});

        expect(model.parameters[0]).toBe('0x0');
        expect(model.parameters[1]).toBeTruthy();

        expect(formatters.inputBlockNumberFormatter)
            .toHaveBeenCalledWith('0x0');

        expect(model.rpcMethod).toBe('eth_getBlockByHash');
    });

    it('should call beforeExecution with block number as parameter and call inputBlockNumberFormatter', () => {
        model.parameters = [100, true];

        formatters.inputBlockNumberFormatter
            .mockReturnValueOnce('0x0');

        model.beforeExecution({});

        expect(model.parameters[0]).toBe('0x0');
        expect(model.parameters[1]).toBeTruthy();

        expect(formatters.inputBlockNumberFormatter)
            .toHaveBeenCalledWith(100);

        expect(model.rpcMethod).toBe('eth_getBlockByNumber');
    });

    it('afterExecution should map the response', () => {
        formatters.outputBlockFormatter
            .mockReturnValueOnce({empty: false});

        expect(model.afterExecution({})).toHaveProperty('empty', false);

        expect(formatters.outputBlockFormatter)
            .toHaveBeenCalledWith({});
    });
});
