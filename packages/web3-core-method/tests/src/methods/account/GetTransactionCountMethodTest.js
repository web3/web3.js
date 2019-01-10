import {formatters} from 'web3-core-helpers';
import * as Utils from 'web3-utils';
import GetTransactionCountMethod from '../../../../src/methods/account/GetTransactionCountMethod';

// Mocks
jest.mock('formatters');
jest.mock('Utils');

/**
 * GetTransactionCountMethod test
 */
describe('GetTransactionCountMethodTest', () => {
    let model;

    beforeEach(() => {
        model = new GetTransactionCountMethod(Utils, formatters);
    });

    it('static Type property returns "CALL"', () => {
        expect(GetTransactionCountMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return eth_getTransactionCount', () => {
        expect(model.rpcMethod).toEqual('eth_getTransactionCount');
    });

    it('parametersAmount should return 2', () => {
        expect(model.parametersAmount).toEqual(2);
    });

    it('beforeExecution should call inputAddressFormatter and inputDefaultBlockNumberFormatter', () => {
        model.parameters = ['string', 100];

        formatters.inputAddressFormatter.mockReturnValueOnce('0x0');

        formatters.inputDefaultBlockNumberFormatter.mockReturnValueOnce('0x0');

        model.beforeExecution({});

        expect(model.parameters[0]).toEqual('0x0');

        expect(model.parameters[1]).toEqual('0x0');

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('string');

        expect(formatters.inputDefaultBlockNumberFormatter).toHaveBeenCalledWith(100, {});
    });

    it('afterExecution should call hexToNumber on the response and return it', () => {
        Utils.hexToNumber.mockReturnValueOnce(100);

        expect(model.afterExecution('0x0')).toEqual(100);

        expect(Utils.hexToNumber).toHaveBeenCalledWith('0x0');
    });
});
