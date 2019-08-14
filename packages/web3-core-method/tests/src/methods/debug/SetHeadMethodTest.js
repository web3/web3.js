import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import SetHeadMethod from '../../../../src/methods/debug/SetHeadMethod';

/**
 * SetHeadMethod test
 */
describe('SetHeadMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SetHeadMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_setHead');

        expect(method.parametersAmount).toEqual(1);
    });

    it('calls beforeExecution and maps the given number to a hex string', () => {
        method.parameters = [1];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('0x1');
    });
});
