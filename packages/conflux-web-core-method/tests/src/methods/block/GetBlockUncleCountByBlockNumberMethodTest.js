import AbstractGetBlockUncleCountMethod from '../../../../lib/methods/block/AbstractGetBlockUncleCountMethod';
import GetBlockUncleCountByBlockNumberMethod from '../../../../src/methods/block/GetBlockUncleCountByBlockNumberMethod';

/**
 * GetBlockUncleCountByBlockNumberMethod test
 */
describe('GetBlockUncleCountByBlockNumberMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetBlockUncleCountByBlockNumberMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractGetBlockUncleCountMethod);

        expect(method.rpcMethod).toEqual('eth_getUncleCountByBlockNumber');
    });
});
