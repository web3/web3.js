import GetProtocolVersionMethod from '../../../../src/methods/network/GetProtocolVersionMethod';

/**
 * GetProtocolVersionMethod test
 */
describe('GetProtocolVersionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetProtocolVersionMethod({}, {});
    });

    it('static Type property returns "CALL"', () => {
        expect(GetProtocolVersionMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return eth_protocolVersion', () => {
        expect(method.rpcMethod).toEqual('eth_protocolVersion');
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
