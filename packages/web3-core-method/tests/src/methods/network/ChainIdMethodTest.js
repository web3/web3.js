import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import ChainIdMethod from '../../../../src/methods/network/ChainIdMethod';

/**
 * ChainIdMethod test
 */
describe('ChainIdMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new ChainIdMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_chainId');

        expect(method.parametersAmount).toEqual(0);
    });

    it('afterExecution should map the response', () => {
        expect(method.afterExecution('0x0')).toEqual(61);
    });
});
