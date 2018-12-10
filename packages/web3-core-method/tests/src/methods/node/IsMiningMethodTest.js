import IsMiningMethod from '../../../../src/methods/node/IsMiningMethod';

/**
 * IsMiningMethod test
 */
describe('IsMiningMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new IsMiningMethod({}, {}, {});
    });

    it('rpcMethod should return eth_mining', () => {
        expect(method.rpcMethod)
            .toBe('eth_mining');
    });

    it('parametersAmount should return 0', () => {
        expect(method.parametersAmount)
            .toBe(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [];
        method.beforeExecution();

        expect(method.parameters[0])
            .toBe(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(method.afterExecution('version'))
            .toBe('version');
    });
});
