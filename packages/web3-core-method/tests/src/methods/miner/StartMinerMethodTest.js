import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StartMinerMethod from '../../../../src/methods/miner/StartMinerMethod';

/**
 * StartMinerMethod test
 */
describe('StartMinerMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StartMinerMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('miner_start');

        expect(method.parametersAmount).toEqual(1);
    });
});
