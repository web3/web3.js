import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import SetEtherBaseMethod from '../../../../src/methods/miner/SetEtherBaseMethod';

/**
 * SetEtherBaseMethod test
 */
describe('SetEtherBaseMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SetEtherBaseMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('miner_setEtherbase');

        expect(method.parametersAmount).toEqual(1);
    });

    it('calls beforeExecution and formats the given address', () => {
        method.parameters = ['0x00'];
        method.beforeExecution();

        expect(method.parameters[0]).toEqual('0x0');
    });
});
