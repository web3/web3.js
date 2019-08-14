import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetBlockNumberMethod from '../../../../src/methods/block/GetBlockNumberMethod';

/**
 * GetBlockNumberMethod test
 */
describe('GetBlockNumberMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetBlockNumberMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_blockNumber');

        expect(method.parametersAmount).toEqual(0);

        expect(method.formatters).toEqual(null);
    });

    it('afterExecution should map theresponse', () => {
        expect(method.afterExecution('0x0')).toEqual(100);
    });
});
