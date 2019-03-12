import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import AbstractGetUncleMethod from '../../../../lib/methods/block/AbstractGetUncleMethod';

// Mocks
jest.mock('Utils');
jest.mock('formatters');

/**
 * AbstractGetUncleMethod test
 */
describe('AbstractGetUncleMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new AbstractGetUncleMethod('rpcMethod', Utils, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('rpcMethod');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual(Utils);

        expect(method.formatters).toEqual(formatters);

        expect(method.moduleInstance).toEqual({});
    });

    it('calls beforeExecution with a block hash as parameter and calls the inputBlockNumberFormatter', () => {
        method.parameters = ['0x0', 100];

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('0x0');

        Utils.numberToHex.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('0x0');
        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith('0x0');

        expect(Utils.numberToHex).toHaveBeenCalledWith(100);
    });

    it('afterExecution should map the response', () => {
        formatters.outputBlockFormatter.mockReturnValueOnce({block: true});

        expect(method.afterExecution({})).toHaveProperty('block', true);

        expect(formatters.outputBlockFormatter).toHaveBeenCalledWith({});
    });
});
