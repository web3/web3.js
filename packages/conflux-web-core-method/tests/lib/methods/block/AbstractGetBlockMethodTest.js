import {formatters} from 'conflux-web-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import AbstractGetBlockMethod from '../../../../lib/methods/block/AbstractGetBlockMethod';

// Mocks
jest.mock('conflux-web-core-helpers');

/**
 * AbstractGetBlockMethodTest test
 */
describe('AbstractGetBlockMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new AbstractGetBlockMethod('rpcMethod', {}, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('rpcMethod');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual({});

        expect(method.formatters).toEqual(formatters);

        expect(method.moduleInstance).toEqual({});
    });

    it('calls beforeExecution with block hash as parameter and it calls inputBlockNumberFormatter', () => {
        method.parameters = ['0x0', true];

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toEqual(true);

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith('0x0');
    });

    it('calls beforeExecution with block hash and callback as parameter and it calls inputBlockNumberFormatter', () => {
        const callback = jest.fn();
        method.parameters = ['0x0', callback];

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toEqual(false);

        expect(method.callback).toEqual(callback);

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith('0x0');
    });

    it('afterExecution should map the response', () => {
        formatters.outputBlockFormatter.mockReturnValueOnce({empty: false});

        expect(method.afterExecution({})).toHaveProperty('empty', false);

        expect(formatters.outputBlockFormatter).toHaveBeenCalledWith({});
    });
});
