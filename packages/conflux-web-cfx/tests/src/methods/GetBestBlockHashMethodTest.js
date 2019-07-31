import GetBestBlockHashMethod from '../../../src/methods/GetBestBlockHashMethod';

/**
 * GetBlocksByEpochMethod test
 */
describe('GetBestBlockHashMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetBestBlockHashMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method.rpcMethod).toEqual('cfx_getBestBlockHash');
    });
});
