import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StopMiningMethod from '../../../../src/methods/miner/StopMiningMethod';

/**
 * StopMiningMethod test
 */
describe('StopMiningMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StopMiningMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('miner_stop');

        expect(method.parametersAmount).toEqual(0);
    });
});
