import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import AbstractCallMethod from '../../../../lib/methods/AbstractCallMethod';
import GetBlockUncleCountMethod from '../../../../src/methods/block/GetBlockUncleCountMethod';

// Mocks
jest.mock('Utils');
jest.mock('formatters');

/**
 * GetBlockUncleCountMethod test
 */
describe('GetBlockUncleCountMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetBlockUncleCountMethod(Utils, formatters);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractCallMethod);

        expect(method.rpcMethod).toEqual('eth_getUncleCountByBlockNumber');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(Utils);

        expect(method.formatters).toEqual(formatters);
    });

    it('should call beforeExecution with block hash as parameter and call inputBlockNumberFormatter', () => {
        method.parameters = ['0x0'];

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('0x0');

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith('0x0');

        expect(method.rpcMethod).toEqual('eth_getUncleCountByBlockHash');
    });

    it('should call beforeExecution with block number as parameter and call inputBlockNumberFormatter', () => {
        method.parameters = [100];

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('0x0');

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith(100);

        expect(method.rpcMethod).toEqual('eth_getUncleCountByBlockNumber');
    });

    it('afterExecution should map the hex string to a number', () => {
        Utils.hexToNumber.mockReturnValueOnce(100);

        expect(method.afterExecution('0x0')).toEqual(100);

        expect(Utils.hexToNumber).toHaveBeenCalledWith('0x0');
    });
});
