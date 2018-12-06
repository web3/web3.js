import * as Utils from 'packages/web3-utils/dist/web3-utils.cjs';
import GetHashrateMethodModel from '../../../../src/models/methods/node/GetHashrateMethodModel';

// Mocks
jest.mock('Utils');

/**
 * GetHashrateMethodModel test
 */
describe('GetHashrateMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetHashrateMethodModel(Utils, {});
    });

    it('rpcMethod should return eth_hashrate', () => {
        expect(model.rpcMethod)
            .toBe('eth_hashrate');
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

    it('afterExecution should map the response', () => {
        Utils.hexToNumber
            .mockReturnValueOnce(100);

        expect(model.afterExecution('0x0')).toBe(100);

        expect(Utils.hexToNumber)
            .toHaveBeenCalledWith('0x0');
    });
});
