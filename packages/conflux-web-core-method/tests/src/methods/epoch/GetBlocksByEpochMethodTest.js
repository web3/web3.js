import AbstractGetBlockMethod from '../../../../lib/methods/block/AbstractGetBlockMethod';
import GetBlocksByEpochMethod from '../../../../src/methods/epoch/GetBlocksByEpochMethod';

/**
 * GetBlocksByEpochMethod test
 */
describe('GetBlocksByEpochMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetBlocksByEpochMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractGetBlockMethod);
        expect(method.rpcMethod).toEqual('cfx_getBlocksByEpoch');
    });
});
