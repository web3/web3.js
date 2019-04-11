import {formatters} from 'conflux-web-core-helpers';
import * as Utils from 'conflux-web-utils';
import AbstractMethod from '../../../lib/methods/AbstractMethod';
import GetStorageAtMethod from '../../../src/methods/GetStorageAtMethod';

// Mocks
jest.mock('conflux-web-core-helpers');
jest.mock('conflux-web-utils');

/**
 * GetStorageAtMethod test
 */
describe('GetStorageAtMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetStorageAtMethod(Utils, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_getStorageAt');

        expect(method.parametersAmount).toEqual(3);

        expect(method.utils).toEqual(Utils);

        expect(method.formatters).toEqual(formatters);
    });

    it(
        'beforeExecution should call the formatters.inputAddressFormatter, formatters.inputDefaultEpochNumberFormatter ' +
            'and utils.numberToHex method',
        () => {
            method.parameters = ['string', 100, 100];

            formatters.inputAddressFormatter.mockReturnValue('0x0');

            formatters.inputDefaultEpochNumberFormatter.mockReturnValueOnce('0x0');

            Utils.numberToHex.mockReturnValueOnce('0x0');

            method.beforeExecution({});

            expect(method.parameters[0]).toEqual('0x0');

            expect(method.parameters[1]).toEqual('0x0');

            expect(method.parameters[2]).toEqual('0x0');

            expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('string');

            expect(formatters.inputDefaultEpochNumberFormatter).toHaveBeenCalledWith(100, {});

            expect(Utils.numberToHex).toHaveBeenCalledWith(100);
        }
    );

    it(
        'calls beforeExecution without a callback instead of the optional parameter and should call the inputAddressFormatter, inputDefaultEpochNumberFormatter ' +
            'and numberToHex method',
        () => {
            const callback = jest.fn();
            method.parameters = ['string', 100, callback];

            formatters.inputAddressFormatter.mockReturnValue('0x0');

            formatters.inputDefaultEpochNumberFormatter.mockReturnValueOnce('0x0');

            Utils.numberToHex.mockReturnValueOnce('0x0');

            method.beforeExecution({defaultEpoch: 'latest'});

            expect(method.callback).toEqual(callback);

            expect(method.parameters[0]).toEqual('0x0');

            expect(method.parameters[1]).toEqual('0x0');

            expect(method.parameters[2]).toEqual('0x0');

            expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('string');

            expect(formatters.inputDefaultEpochNumberFormatter).toHaveBeenCalledWith('latest', {
                defaultEpoch: 'latest'
            });

            expect(Utils.numberToHex).toHaveBeenCalledWith(100);
        }
    );
});
