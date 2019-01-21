import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import GetUncleMethod from '../../../../src/methods/block/GetUncleMethod';

// Mocks
jest.mock('Utils');
jest.mock('formatters');

/**
 * GetUncleMethod test
 */
describe('GetUncleMethodTest', () => {
    let model;

    beforeEach(() => {
        model = new GetUncleMethod(Utils, formatters);
    });

    it('static Type property returns "CALL"', () => {
        expect(GetUncleMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return eth_getUncleByBlockNumberAndIndex', () => {
        expect(model.rpcMethod).toEqual('eth_getUncleByBlockNumberAndIndex');
    });

    it('parametersAmount should return 2', () => {
        expect(model.parametersAmount).toEqual(2);
    });

    it('should call beforeExecution with block hash as parameter and call inputBlockNumberFormatter', () => {
        model.parameters = ['0x0', 100];

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('0x0');

        Utils.numberToHex.mockReturnValueOnce('0x0');

        model.beforeExecution({});

        expect(model.parameters[0]).toEqual('0x0');
        expect(model.parameters[1]).toEqual('0x0');

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith('0x0');

        expect(Utils.numberToHex).toHaveBeenCalledWith(100);

        expect(model.rpcMethod).toEqual('eth_getUncleByBlockHashAndIndex');
    });

    it('should call beforeExecution with block number as parameter and call inputBlockNumberFormatter', () => {
        model.parameters = [100, 100];

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('0x0');

        Utils.numberToHex.mockReturnValueOnce('0x0');

        model.beforeExecution({});

        expect(model.parameters[0]).toEqual('0x0');
        expect(model.parameters[1]).toEqual('0x0');

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith(100);

        expect(Utils.numberToHex).toHaveBeenCalledWith(100);

        expect(model.rpcMethod).toEqual('eth_getUncleByBlockNumberAndIndex');
    });

    it('afterExecution should map the response', () => {
        formatters.outputBlockFormatter.mockReturnValueOnce({block: true});

        expect(model.afterExecution({})).toHaveProperty('block', true);

        expect(formatters.outputBlockFormatter).toHaveBeenCalledWith({});
    });
});
