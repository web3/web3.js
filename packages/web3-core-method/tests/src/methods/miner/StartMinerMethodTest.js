import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StartMiningMethod from '../../../../src/methods/miner/StartMiningMethod';

/**
 * StartMiningMethod test
 */
describe('StartMiningMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StartMiningMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('miner_start');

        expect(method.parametersAmount).toEqual(1);
    });

    it('beforeExecution should call Utils.numberToHex', () => {
        method.parameters = [1];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('0x1');
    });
});
