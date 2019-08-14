import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import IsSyncingMethod from '../../../../src/methods/node/IsSyncingMethod';

/**
 * IsSyncingMethod test
 */
describe('IsSyncingMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new IsSyncingMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_syncing');

        expect(method.parametersAmount).toEqual(0);
    });

    it('afterExecution should call outputSyncingFormatter and return the response', () => {
        expect(method.afterExecution({})).toHaveProperty('isSyncing', true);
    });

    it('afterExecution should directly return the response', () => {
        expect(method.afterExecution(false)).toEqual(false);
    });
});
