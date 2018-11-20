import GetProtocolVersionMethodModel from '../../../../src/models/methods/network/GetProtocolVersionMethodModel';

/**
 * GetProtocolVersionMethodModel test
 */
describe('GetProtocolVersionMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetProtocolVersionMethodModel({}, {});
    });

    it('rpcMethod should return eth_protocolVersion', () => {
        expect(model.rpcMethod).toBe('eth_protocolVersion');
    });

    it('parametersAmount should return 0', () => {
        expect(model.parametersAmount).toBe(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).toBe(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('version')).toBe('version');
    });
});
