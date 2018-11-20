import ImportRawKeyMethodModel from '../../../../src/models/methods/personal/ImportRawKeyMethodModel';

/**
 * ImportRawKeyMethodModel test
 */
describe('ImportRawKeyMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new ImportRawKeyMethodModel({}, {});
    });

    it('rpcMethod should return personal_importRawKey', () => {
        expect(model.rpcMethod).toBe('personal_importRawKey');
    });

    it('parametersAmount should return 2', () => {
        expect(model.parametersAmount).toBe(2);
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
