import GetProtocolVersionMethod from '../../../../src/methods/network/GetProtocolVersionMethod';

/**
 * GetProtocolVersionMethod test
 */
describe('GetProtocolVersionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetProtocolVersionMethod({}, {}, {});
    });

    it('rpcMethod should return eth_protocolVersion', () => {
        expect(method.rpcMethod)
            .toBe('eth_protocolVersion');
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
