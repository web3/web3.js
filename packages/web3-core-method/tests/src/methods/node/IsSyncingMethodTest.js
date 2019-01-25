import {formatters} from 'web3-core-helpers';
import AbstractCallMethod from '../../../../lib/methods/AbstractCallMethod';
import IsSyncingMethod from '../../../../src/methods/node/IsSyncingMethod';

// Mocks
jest.mock('formatters');

/**
 * IsSyncingMethod test
 */
describe('IsSyncingMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new IsSyncingMethod(null, formatters);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractCallMethod);

        expect(method.rpcMethod).toEqual('eth_syncing');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });

    it('afterExecution should call outputSyncingFormatter and return the response', () => {
        formatters.outputSyncingFormatter.mockReturnValueOnce({isSyncing: true});

        expect(method.afterExecution({})).toHaveProperty('isSyncing', true);

        expect(formatters.outputSyncingFormatter).toHaveBeenCalledWith({});
    });

    it('afterExecution should directly return the response', () => {
        expect(method.afterExecution(false)).toEqual(false);
    });
});
