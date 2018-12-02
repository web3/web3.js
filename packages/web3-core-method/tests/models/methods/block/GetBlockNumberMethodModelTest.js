import * as Utils from 'web3-utils';
import GetBlockNumberMethodModel from '../../../../src/models/methods/block/GetBlockNumberMethodModel';

// Mocks
jest.mock('Utils');

/**
 * GetBlockNumberMethodModel test
 */
describe('GetBlockNumberMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetBlockNumberMethodModel(Utils, {});
    });

    it('rpcMethod should return eth_blockNumber', () => {
        expect(model.rpcMethod)
            .toBe('eth_blockNumber');
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

    it('afterExecution should map theresponse', () => {
        Utils.hexToNumber
            .mockReturnValueOnce(100);

        expect(model.afterExecution('0x0'))
            .toBe(100);

        expect(Utils.hexToNumber)
            .toHaveBeenCalledWith('0x0');
    });
});
