import AbstractGetUncleMethod from '../../../../lib/methods/block/AbstractGetUncleMethod';
import GetUncleByBlockNumberAndIndexMethod from '../../../../src/methods/block/GetUncleByBlockNumberAndIndexMethod';

/**
 * GetUncleByBlockNumberAndIndexMethod test
 */
describe('GetUncleByBlockNumberAndIndexMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetUncleByBlockNumberAndIndexMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractGetUncleMethod);

        expect(method.rpcMethod).toEqual('eth_getUncleByBlockNumberAndIndex');
    });
});
