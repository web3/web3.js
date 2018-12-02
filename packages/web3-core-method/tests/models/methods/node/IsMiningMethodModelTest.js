import IsMiningMethodModel from '../../../../src/models/methods/node/IsMiningMethodModel';

/**
 * IsMiningMethodModel test
 */
describe('IsMiningMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new IsMiningMethodModel({}, {});
    });

    it('rpcMethod should return eth_mining', () => {
        expect(model.rpcMethod)
            .toBe('eth_mining');
    });

    it('parametersAmount should return 0', () => {
        expect(model.parametersAmount)
            .toBe(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0])
            .toBe(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('version'))
            .toBe('version');
    });
});
