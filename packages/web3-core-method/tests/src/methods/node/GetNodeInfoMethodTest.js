import GetNodeInfoMethod from '../../../../src/methods/node/GetNodeInfoMethod';

/**
 * GetNodeInfoMethod test
 */
describe('GetNodeInfoMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetNodeInfoMethod({}, {});
    });

    it('static Type property returns "CALL"', () => {
        expect(GetNodeInfoMethod.Type)
            .toBe('CALL');
    });

    it('rpcMethod should return web3_clientVersion', () => {
        expect(method.rpcMethod)
            .toBe('web3_clientVersion');
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
