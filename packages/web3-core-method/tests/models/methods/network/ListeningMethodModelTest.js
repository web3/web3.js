import ListeningMethodModel from '../../../../src/models/methods/network/ListeningMethodModel';

/**
 * ListeningMethodModel test
 */
describe('ListeningMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new ListeningMethodModel({}, {});
    });

    it('rpcMethod should return net_listening', () => {
        expect(model.rpcMethod).to.equal('net_listening');
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
