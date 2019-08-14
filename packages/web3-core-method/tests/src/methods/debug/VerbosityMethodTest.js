import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import VerbosityMethod from '../../../../src/methods/debug/VerbosityMethod';

/**
 * VerbosityMethod test
 */
describe('VerbosityMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new VerbosityMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_verbosity');

        expect(method.parametersAmount).toEqual(1);
    });

    it('calls beforeExecution and maps the given number to a hex string', () => {
        method.parameters = [1];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('0x1');
    });
});
