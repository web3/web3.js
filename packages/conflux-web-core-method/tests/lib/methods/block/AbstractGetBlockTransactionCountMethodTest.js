import * as Utils from 'conflux-web-utils';
import {formatters} from 'conflux-web-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import AbstractGetBlockTransactionCountMethod from '../../../../lib/methods/block/AbstractGetBlockTransactionCountMethod';

// Mocks
jest.mock('conflux-web-utils');
jest.mock('conflux-web-core-helpers');

/**
 * AbstractGetBlockTransactionCountMethod test
 */
describe('AbstractGetBlockTransactionCountMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new AbstractGetBlockTransactionCountMethod('rpcMethod', Utils, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('rpcMethod');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(Utils);

        expect(method.formatters).toEqual(formatters);

        expect(method.moduleInstance).toEqual({});
    });

    it('calls beforeExecution with a block number as parameter and calls inputBlockAddressFormatter', () => {
        method.parameters = [100];

        formatters.inputBlockAddressFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('0x0');

        expect(formatters.inputBlockAddressFormatter).toHaveBeenCalledWith(100);
    });

    it('calls afterExecution and maps the hex string to a number', () => {
        Utils.hexToNumber.mockReturnValueOnce(100);

        expect(method.afterExecution('0x0')).toEqual(100);

        expect(Utils.hexToNumber).toHaveBeenCalledWith('0x0');
    });
});
