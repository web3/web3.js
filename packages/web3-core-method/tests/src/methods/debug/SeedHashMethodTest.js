import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import SeedHashMethod from '../../../../src/methods/debug/SeedHashMethod';

/**
 * SeedHashMethod test
 */
describe('SeedHashMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SeedHashMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_seedHash');

        expect(method.parametersAmount).toEqual(0);
    });

    it('calls beforeExecution and maps the given number to a hex string', () => {
        method.parameters = [1];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('0x1');
    });
});
