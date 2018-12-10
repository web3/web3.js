import {formatters} from 'web3-core-helpers';
import GetBlockMethod from '../../../../src/methods/block/GetBlockMethod';

// Mocks
jest.mock('formatters');

/**
 * GetBlockMethod test
 */
describe('GetBlockMethod', () => {
    let method;

    beforeEach(() => {
        method = new GetBlockMethod({}, {}, formatters);
    });

    it('rpcMethod should return eth_getBlockByNumber', () => {
        expect(method.rpcMethod)
            .toBe('eth_getBlockByNumber');
    });

    it('parametersAmount should return 2', () => {
        expect(method.parametersAmount)
            .toBe(2);
    });

    it('should call beforeExecution with block hash as parameter and call inputBlockNumberFormatter', () => {
        method.parameters = ['0x0', true];

        formatters.inputBlockNumberFormatter
            .mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0])
            .toBe('0x0');

        expect(method.parameters[1])
            .toBeTruthy();

        expect(formatters.inputBlockNumberFormatter)
            .toHaveBeenCalledWith('0x0');

        expect(method.rpcMethod).toBe('eth_getBlockByHash');
    });

    it('should call beforeExecution with block number as parameter and call inputBlockNumberFormatter', () => {
        method.parameters = [100, true];

        formatters.inputBlockNumberFormatter
            .mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0])
            .toBe('0x0');

        expect(method.parameters[1])
            .toBeTruthy();

        expect(formatters.inputBlockNumberFormatter)
            .toHaveBeenCalledWith(100);

        expect(method.rpcMethod)
            .toBe('eth_getBlockByNumber');
    });

    it('afterExecution should map the response', () => {
        formatters.outputBlockFormatter
            .mockReturnValueOnce({empty: false});

        expect(method.afterExecution({}))
            .toHaveProperty('empty', false);

        expect(formatters.outputBlockFormatter)
            .toHaveBeenCalledWith({});
    });
});
