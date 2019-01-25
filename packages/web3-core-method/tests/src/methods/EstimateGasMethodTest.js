import {formatters} from 'web3-core-helpers';
import * as Utils from 'web3-utils';
import AbstractCallMethod from '../../../lib/methods/AbstractCallMethod';
import EstimateGasMethod from '../../../src/methods/EstimateGasMethod';

// Mocks
jest.mock('Utils');
jest.mock('formatters');

/**
 * EstimateGasMethod test
 */
describe('EstimateGasMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new EstimateGasMethod(Utils, formatters);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractCallMethod);

        expect(method.rpcMethod).toEqual('eth_estimateGas');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(Utils);

        expect(method.formatters).toEqual(formatters);
    });

    it('beforeExecution should call the inputCallFormatter', () => {
        method.parameters = [{}];

        formatters.inputCallFormatter.mockReturnValueOnce({empty: true});

        method.beforeExecution({});

        expect(method.parameters[0]).toHaveProperty('empty', true);

        expect(formatters.inputCallFormatter).toHaveBeenCalledWith({}, {});
    });

    it('afterExecution should call hexToNumber and return the response', () => {
        Utils.hexToNumber.mockReturnValueOnce(100);

        expect(method.afterExecution({})).toEqual(100);

        expect(Utils.hexToNumber).toHaveBeenCalledWith({});
    });
});
