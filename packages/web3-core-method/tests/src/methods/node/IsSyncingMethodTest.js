import {formatters} from 'web3-core-helpers';
import IsSyncingMethod from '../../../../src/methods/node/IsSyncingMethod';

// Mocks
jest.mock('formatters');

/**
 * IsSyncingMethod test
 */
describe('IsSyncingMethodTest', () => {
    let model;

    beforeEach(() => {
        model = new IsSyncingMethod({}, formatters);
    });

    it('static Type property returns "CALL"', () => {
        expect(IsSyncingMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return eth_syncing', () => {
        expect(model.rpcMethod).toEqual('eth_syncing');
    });

    it('parametersAmount should return 0', () => {
        expect(model.parametersAmount).toEqual(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).toEqual(undefined);
    });

    it('afterExecution should map the response', () => {
        formatters.outputSyncingFormatter.mockReturnValueOnce({isSyncing: true});

        expect(model.afterExecution({})).toHaveProperty('isSyncing', true);

        expect(formatters.outputSyncingFormatter).toHaveBeenCalledWith({});
    });
});
