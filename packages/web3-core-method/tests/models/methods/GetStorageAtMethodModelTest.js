import {formatters} from 'web3-core-helpers';
import * as Utils from 'web3-utils';
import GetStorageAtMethodModel from '../../../src/models/methods/GetStorageAtMethod';

// Mocks
jest.mock('formatters');
jest.mock('Utils');

/**
 * GetStorageAtMethod test
 */
describe('GetStorageAtMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetStorageAtMethodModel(Utils, formatters);
    });

    it('rpcMethod should return eth_getStorageAt', () => {
        expect(model.rpcMethod)
            .toBe('eth_getStorageAt');
    });

    it('parametersAmount should return 3', () => {
        expect(model.parametersAmount)
            .toBe(3);
    });

    it(
        'beforeExecution should call the formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter ' +
            'and utils.numberToHex method',
        () => {
            model.parameters = ['string', 100, 100];

            formatters.inputAddressFormatter
                .mockReturnValue('0x0');

            formatters.inputDefaultBlockNumberFormatter
                .mockReturnValueOnce('0x0');

            Utils.numberToHex
                .mockReturnValueOnce('0x0');

            model.beforeExecution({});

            expect(model.parameters[0])
                .toBe('0x0');

            expect(model.parameters[1])
                .toBe('0x0');

            expect(model.parameters[2])
                .toBe('0x0');

            expect(formatters.inputAddressFormatter)
                .toHaveBeenCalledWith('string');

            expect(formatters.inputDefaultBlockNumberFormatter)
                .toHaveBeenCalledWith(100, {});

            expect(Utils.numberToHex)
                .toHaveBeenCalledWith(100);
        }
    );

    it('afterExecution should just return the response', () => {
        const object = {};

        expect(model.afterExecution(object))
            .toBe(object);
    });
});
