import GetWorkMethodModel from '../../../../src/models/methods/node/GetWorkMethodModel';

/**
 * GetWorkMethodModel test
 */
describe('GetWorkMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetWorkMethodModel({}, {});
    });

    it('rpcMethod should return eth_getWork', () => {
        expect(model.rpcMethod).to.equal('eth_getWork');
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
