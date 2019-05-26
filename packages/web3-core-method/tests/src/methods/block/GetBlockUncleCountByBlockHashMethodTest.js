import AbstractGetBlockUncleCountMethod from '../../../../lib/methods/block/AbstractGetBlockUncleCountMethod';
import GetBlockUncleCountByBlockHashMethod from '../../../../src/methods/block/GetBlockUncleCountByBlockHashMethod';

/**
 * GetBlockUncleCountByBlockNumberMethod test
 */
describe('GetBlockUncleCountByBlockHashMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetBlockUncleCountByBlockHashMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractGetBlockUncleCountMethod);

        expect(method.rpcMethod).toEqual('eth_getUncleCountByBlockHash');
    });
});
