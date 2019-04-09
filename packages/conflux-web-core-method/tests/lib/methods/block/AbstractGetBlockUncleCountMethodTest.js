import * as Utils from 'conflux-web-utils';
import {formatters} from 'conflux-web-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import AbstractGetBlockUncleCountMethod from '../../../../lib/methods/block/AbstractGetBlockUncleCountMethod';

// Mocks
jest.mock('conflux-web-utils');
jest.mock('conflux-web-core-helpers');

/**
 * AbstractGetBlockUncleCountMethod test
 */
describe('AbstractGetBlockUncleCountMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new AbstractGetBlockUncleCountMethod('rpcMethod', Utils, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('rpcMethod');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(Utils);

        expect(method.formatters).toEqual(formatters);

        expect(method.moduleInstance).toEqual({});
    });

    it('calls beforeExecution with a block number hash as parameter and calls the inputBlockNumberFormatter', () => {
        method.parameters = ['0x0'];

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('0x0');

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith('0x0');
    });

    it('afterExecution should map the hex string to a number', () => {
        Utils.hexToNumber.mockReturnValueOnce(100);

        expect(method.afterExecution('0x0')).toEqual(100);

        expect(Utils.hexToNumber).toHaveBeenCalledWith('0x0');
    });
});
