import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import AbstractCallMethod from '../../../../lib/methods/AbstractCallMethod';
import GetUncleMethod from '../../../../src/methods/block/GetUncleMethod';

// Mocks
jest.mock('Utils');
jest.mock('formatters');

/**
 * GetUncleMethod test
 */
describe('GetUncleMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetUncleMethod(Utils, formatters);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractCallMethod);

        expect(method.rpcMethod).toEqual('eth_getUncleByBlockNumberAndIndex');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual(Utils);

        expect(method.formatters).toEqual(formatters);
    });

    it('should call beforeExecution with block hash as parameter and call inputBlockNumberFormatter', () => {
        method.parameters = ['0x0', 100];

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('0x0');

        Utils.numberToHex.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('0x0');
        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith('0x0');

        expect(Utils.numberToHex).toHaveBeenCalledWith(100);

        expect(method.rpcMethod).toEqual('eth_getUncleByBlockHashAndIndex');
    });

    it('should call beforeExecution with block number as parameter and call inputBlockNumberFormatter', () => {
        method.parameters = [100, 100];

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('0x0');

        Utils.numberToHex.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('0x0');
        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith(100);

        expect(Utils.numberToHex).toHaveBeenCalledWith(100);

        expect(method.rpcMethod).toEqual('eth_getUncleByBlockNumberAndIndex');
    });

    it('afterExecution should map the response', () => {
        formatters.outputBlockFormatter.mockReturnValueOnce({block: true});

        expect(method.afterExecution({})).toHaveProperty('block', true);

        expect(formatters.outputBlockFormatter).toHaveBeenCalledWith({});
    });
});
