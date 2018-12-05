import {formatters} from 'web3-core-helpers';
import * as Utils from 'web3-utils';
import GetTransactionFromBlockMethodModel from '../../../../src/models/methods/transaction/GetTransactionFromBlockMethodModel';

// Mocks
jest.mock('formatters');
jest.mock('Utils');

/**
 * GetStorageAtMethod test
 */
describe('GetStorageAtMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetTransactionFromBlockMethodModel(Utils, formatters);
    });

    it('rpcMethod should return eth_getTransactionByBlockNumberAndIndex', () => {
        expect(model.rpcMethod)
            .toBe('eth_getTransactionByBlockNumberAndIndex');
    });

    it('parametersAmount should return 2', () => {
        expect(model.parametersAmount)
            .toBe(2);
    });

    it(
        'should call beforeExecution with block hash as parameter ' +
            'and should call formatters.inputBlockNumberFormatter and utils.numberToHex',
        () => {
            model.parameters = ['0x0', 100];

            formatters.inputBlockNumberFormatter
                .mockReturnValueOnce('0x0');

            Utils.numberToHex
                .mockReturnValueOnce('0x0');

            model.beforeExecution({});

            expect(model.parameters[0])
                .toBe('0x0');

            expect(model.parameters[1])
                .toBe('0x0');

            expect(formatters.inputBlockNumberFormatter)
                .toHaveBeenCalledWith('0x0');

            expect(Utils.numberToHex)
                .toHaveBeenCalledWith(100);

            expect(model.rpcMethod)
                .toBe('eth_getTransactionByBlockHashAndIndex');
        }
    );

    it(
        'should call beforeExecution with block number as parameter  ' +
            'and should call formatters.inputBlockNumberFormatter and utils.numberToHex',
        () => {
            model.parameters = [100, 100];

            formatters.inputBlockNumberFormatter
                .mockReturnValueOnce('0x0');

            Utils.numberToHex
                .mockReturnValueOnce('0x0');

            model.beforeExecution({});

            expect(model.parameters[0])
                .toBe('0x0');

            expect(model.parameters[1])
                .toBe('0x0');

            expect(formatters.inputBlockNumberFormatter)
                .toHaveBeenCalledWith(100);

            expect(Utils.numberToHex)
                .toHaveBeenCalledWith(100);

            expect(model.rpcMethod)
                .toBe('eth_getTransactionByBlockNumberAndIndex');
        }
    );

    it('afterExecution should map the response', () => {
        formatters.outputTransactionFormatter
            .mockReturnValueOnce({empty: false});

        expect(model.afterExecution({}))
            .toHaveProperty('empty', false);

        expect(formatters.outputTransactionFormatter)
            .toHaveBeenCalledWith({});
    });
});
