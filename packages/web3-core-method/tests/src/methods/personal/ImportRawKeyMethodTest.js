import ImportRawKeyMethod from '../../../../src/methods/personal/ImportRawKeyMethod';

/**
 * ImportRawKeyMethod test
 */
describe('ImportRawKeyMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new ImportRawKeyMethod({}, {});
    });

    it('static Type property returns "CALL"', () => {
        expect(ImportRawKeyMethod.Type)
            .toBe('CALL');
    });

    it('rpcMethod should return personal_importRawKey', () => {
        expect(method.rpcMethod)
            .toBe('personal_importRawKey');
    });

    it('parametersAmount should return 2', () => {
        expect(method.parametersAmount)
            .toBe(2);
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
