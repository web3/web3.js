import GetWorkMethodModel from '../../../../src/models/methods/node/GetWorkMethod';

/**
 * GetWorkMethod test
 */
describe('GetWorkMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetWorkMethodModel({}, {});
    });

    it('rpcMethod should return eth_getWork', () => {
        expect(model.rpcMethod)
            .toBe('eth_getWork');
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
