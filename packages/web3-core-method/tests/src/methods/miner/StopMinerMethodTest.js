import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StopMinerMethod from '../../../../src/methods/miner/StopMinerMethod';

/**
 * StopMinerMethod test
 */
describe('StopMinerMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StopMinerMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('miner_stop');

        expect(method.parametersAmount).toEqual(0);
    });
});
