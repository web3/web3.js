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
        expect(ImportRawKeyMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return personal_importRawKey', () => {
        expect(method.rpcMethod).toEqual('personal_importRawKey');
    });

    it('parametersAmount should return 2', () => {
        expect(method.parametersAmount).toEqual(2);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [];
        method.beforeExecution();

        expect(method.parameters[0]).toEqual(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(method.afterExecution('version')).toEqual('version');
    });
});
