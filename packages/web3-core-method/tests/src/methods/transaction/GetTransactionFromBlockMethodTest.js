import {formatters} from 'web3-core-helpers';
import * as Utils from 'web3-utils';
import GetTransactionFromBlockMethod from '../../../../src/methods/transaction/GetTransactionFromBlockMethod';

// Mocks
jest.mock('formatters');
jest.mock('Utils');

/**
 * GetTransactionFromBlockMethod test
 */
describe('GetTransactionFromBlockMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetTransactionFromBlockMethod(Utils, formatters);
    });

    it('static Type property returns "CALL"', () => {
        expect(GetTransactionFromBlockMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return eth_getTransactionByBlockNumberAndIndex', () => {
        expect(method.rpcMethod).toEqual('eth_getTransactionByBlockNumberAndIndex');
    });

    it('parametersAmount should return 2', () => {
        expect(method.parametersAmount).toEqual(2);
    });

    it(
        'should call beforeExecution with block hash as parameter ' +
            'and should call formatters.inputBlockNumberFormatter and utils.numberToHex',
        () => {
            method.parameters = ['0x0', 100];

            formatters.inputBlockNumberFormatter.mockReturnValueOnce('0x0');

            Utils.numberToHex.mockReturnValueOnce('0x0');

            method.beforeExecution({});

            expect(method.parameters[0]).toEqual('0x0');

            expect(method.parameters[1]).toEqual('0x0');

            expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith('0x0');

            expect(Utils.numberToHex).toHaveBeenCalledWith(100);

            expect(method.rpcMethod).toEqual('eth_getTransactionByBlockHashAndIndex');
        }
    );

    it(
        'should call beforeExecution with block number as parameter  ' +
            'and should call formatters.inputBlockNumberFormatter and utils.numberToHex',
        () => {
            method.parameters = [100, 100];

            formatters.inputBlockNumberFormatter.mockReturnValueOnce('0x0');

            Utils.numberToHex.mockReturnValueOnce('0x0');

            method.beforeExecution({});

            expect(method.parameters[0]).toEqual('0x0');

            expect(method.parameters[1]).toEqual('0x0');

            expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith(100);

            expect(Utils.numberToHex).toHaveBeenCalledWith(100);

            expect(method.rpcMethod).toEqual('eth_getTransactionByBlockNumberAndIndex');
        }
    );

    it('afterExecution should map the response', () => {
        formatters.outputTransactionFormatter.mockReturnValueOnce({empty: false});

        expect(method.afterExecution({})).toHaveProperty('empty', false);

        expect(formatters.outputTransactionFormatter).toHaveBeenCalledWith({});
    });
});
