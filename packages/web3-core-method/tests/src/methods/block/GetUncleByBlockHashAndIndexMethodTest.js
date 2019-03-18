import AbstractGetUncleMethod from '../../../../lib/methods/block/AbstractGetUncleMethod';
import GetUncleByBlockHashAndIndexMethod from '../../../../src/methods/block/GetUncleByBlockHashAndIndexMethod';

/**
 * GetUncleByBlockHashAndIndexMethod test
 */
describe('GetUncleByBlockHashAndIndexMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetUncleByBlockHashAndIndexMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractGetUncleMethod);

        expect(method.rpcMethod).toEqual('eth_getUncleByBlockHashAndIndex');
    });
});
