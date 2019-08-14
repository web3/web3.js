import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetHashrateMethod from '../../../../src/methods/node/GetHashrateMethod';

/**
 * GetHashrateMethod test
 */
describe('GetHashrateMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetHashrateMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_hashrate');

        expect(method.parametersAmount).toEqual(0);
    });

    it('afterExecution should map the response', () => {
        expect(method.afterExecution('0x0')).toEqual(100);
    });
});
