import * as Utils from 'web3-utils';
import GetCoinbaseMethodModel from '../../../../src/models/methods/node/GetCoinbaseMethodModel';

// Mocks
jest.mock('Utils');

/**
 * GetCoinbaseMethodModel test
 */
describe('GetCoinbaseMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetCoinbaseMethodModel(Utils, {});
    });

    it('rpcMethod should return eth_coinbase', () => {
        expect(model.rpcMethod)
            .toBe('eth_coinbase');
    });

    it('parametersAmount should return 0', () => {
        expect(model.parametersAmount)
            .toBe(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0])
            .toBe(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('coinbase'))
            .toBe('coinbase');
    });
});
