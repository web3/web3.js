import IsMiningMethod from '../../../../src/methods/node/IsMiningMethod';

/**
 * IsMiningMethod test
 */
describe('IsMiningMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new IsMiningMethod({}, {});
    });

    it('static Type property returns "CALL"', () => {
        expect(IsMiningMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return eth_mining', () => {
        expect(method.rpcMethod).toEqual('eth_mining');
    });

    it('parametersAmount should return 0', () => {
        expect(method.parametersAmount).toEqual(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [];
        method.beforeExecution();

        expect(method.parameters[0]).toEqual(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(method.afterExecution('version')).toEqual('version');
    });
});
