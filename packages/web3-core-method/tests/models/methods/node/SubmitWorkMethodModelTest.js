import SubmitWorkMethodModel from '../../../../src/models/methods/node/SubmitWorkMethodModel';

/**
 * SubmitWorkMethodModel test
 */
describe('SubmitWorkMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new SubmitWorkMethodModel({}, {});
    });

    it('rpcMethod should return eth_submitWork', () => {
        expect(model.rpcMethod).toBe('eth_submitWork');
    });

    it('parametersAmount should return 3', () => {
        expect(model.parametersAmount).toBe(3);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).toBe(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('submitWork')).toBe('submitWork');
    });
});
