import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import AbstractGetBlockMethod from '../../../../lib/methods/block/AbstractGetBlockMethod';

/**
 * AbstractGetBlockMethodTest test
 */
describe('AbstractGetBlockMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new AbstractGetBlockMethod('rpcMethod', {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('rpcMethod');

        expect(method.parametersAmount).toEqual(2);

        expect(method.moduleInstance).toEqual({});
    });

    it('calls beforeExecution with block hash as parameter and it calls inputBlockNumberFormatter', () => {
        method.parameters = ['0x0', true];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toEqual(true);
    });

    it('calls beforeExecution with block hash and callback as parameter and it calls inputBlockNumberFormatter', () => {
        const callback = jest.fn();
        method.parameters = ['0x0', callback];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toEqual(false);

        expect(method.callback).toEqual(callback);
    });

    it('afterExecution should map the response', () => {
        expect(method.afterExecution({})).toHaveProperty('empty', false);
    });
});
