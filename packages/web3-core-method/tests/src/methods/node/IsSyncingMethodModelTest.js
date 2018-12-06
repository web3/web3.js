import {formatters} from 'packages/web3-core-helpers/dist/web3-core-helpers.cjs';
import IsSyncingMethodModel from '../../../../src/models/methods/node/IsSyncingMethodModel';

// Mocks
jest.mock('formatters');

/**
 * IsSyncingMethodModel test
 */
describe('IsSyncingMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new IsSyncingMethodModel({}, formatters);
    });

    it('rpcMethod should return eth_syncing', () => {
        expect(model.rpcMethod)
            .toBe('eth_syncing');
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
        formatters.outputSyncingFormatter
            .mockReturnValueOnce({isSyncing: true});

        expect(model.afterExecution({}))
            .toHaveProperty('isSyncing', true);

        expect(formatters.outputSyncingFormatter)
            .toHaveBeenCalledWith({});
    });
});
