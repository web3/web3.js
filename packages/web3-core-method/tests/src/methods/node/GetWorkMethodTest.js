import GetWorkMethod from '../../../../src/methods/node/GetWorkMethod';

/**
 * GetWorkMethod test
 */
describe('GetWorkMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetWorkMethod({}, {});
    });

    it('static Type property returns "CALL"', () => {
        expect(GetWorkMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return eth_getWork', () => {
        expect(method.rpcMethod).toEqual('eth_getWork');
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
