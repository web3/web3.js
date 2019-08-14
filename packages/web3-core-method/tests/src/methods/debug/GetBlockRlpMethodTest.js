import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetBlockRlpMethod from '../../../../src/methods/debug/GetBlockRlpMethod';

/**
 * GetBlockRlpMethod test
 */
describe('GetBlockRlpMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetBlockRlpMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_getBlockRlp');

        expect(method.parametersAmount).toEqual(1);
    });

    it('calls beforeExecution and maps the given number to a hex string', () => {
        method.parameters = [1];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('0x1');
    });
});
