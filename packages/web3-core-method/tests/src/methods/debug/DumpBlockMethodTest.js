import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import DumpBlockMethod from '../../../../src/methods/debug/DumpBlockMethod';

/**
 * DumpBlockMethod test
 */
describe('DumpBlockMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new DumpBlockMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_dumpBlock');

        expect(method.parametersAmount).toEqual(1);
    });

    it('calls beforeExecution and maps the given number to a hex string', () => {
        method.parameters = [1];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('0x1');
    });
});
