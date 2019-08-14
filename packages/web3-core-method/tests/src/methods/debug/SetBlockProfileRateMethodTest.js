import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import SetBlockProfileRateMethod from '../../../../src/methods/debug/SetBlockProfileRateMethod';

/**
 * SetBlockProfileRateMethod test
 */
describe('SetBlockProfileRateMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SetBlockProfileRateMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_setBlockProfileRate');

        expect(method.parametersAmount).toEqual(1);
    });

    it('calls beforeExecution and maps the given number to a hex string', () => {
        method.parameters = [1];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('0x1');
    });
});
