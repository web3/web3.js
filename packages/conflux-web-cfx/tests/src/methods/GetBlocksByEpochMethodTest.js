import GetBlocksByEpochMethod from '../../../src/methods/GetBlocksByEpochMethod';

/**
 * GetBlocksByEpochMethod test
 */
describe('GetBlocksByEpochMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetBlocksByEpochMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method.rpcMethod).toEqual('cfx_getBlocksByEpoch');
    });
});
