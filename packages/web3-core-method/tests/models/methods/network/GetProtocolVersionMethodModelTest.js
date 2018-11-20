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
        expect(model.rpcMethod).to.equal('eth_protocolVersion');
    });

    it('parametersAmount should return 0', () => {
        expect(model.parametersAmount).to.equal(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('version')).equal('version');
    });
});
