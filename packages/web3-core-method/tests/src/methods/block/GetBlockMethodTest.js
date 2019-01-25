import {formatters} from 'web3-core-helpers';
import AbstractCallMethod from '../../../../lib/methods/AbstractCallMethod';
import GetBlockMethod from '../../../../src/methods/block/GetBlockMethod';

// Mocks
jest.mock('formatters');

/**
 * GetBlockMethod test
 */
describe('GetBlockMethod', () => {
    let method;

    beforeEach(() => {
        method = new GetBlockMethod(null, formatters);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractCallMethod);

        expect(method.rpcMethod).toEqual('eth_getBlockByNumber');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });

    it('should call beforeExecution with block hash as parameter and call inputBlockNumberFormatter', () => {
        method.parameters = ['0x0', true];

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toBeTruthy();

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith('0x0');

        expect(method.rpcMethod).toEqual('eth_getBlockByHash');
    });

    it('should call beforeExecution with block number as parameter and call inputBlockNumberFormatter', () => {
        method.parameters = [100, true];

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toBeTruthy();

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith(100);

        expect(method.rpcMethod).toEqual('eth_getBlockByNumber');
    });

    it('afterExecution should map the response', () => {
        formatters.outputBlockFormatter.mockReturnValueOnce({empty: false});

        expect(method.afterExecution({})).toHaveProperty('empty', false);

        expect(formatters.outputBlockFormatter).toHaveBeenCalledWith({});
    });
});
