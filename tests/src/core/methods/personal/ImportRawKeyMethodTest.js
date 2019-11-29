import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import ImportRawKeyMethod from '../../../../src/methods/personal/ImportRawKeyMethod';

/**
 * ImportRawKeyMethod test
 */
describe('ImportRawKeyMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new ImportRawKeyMethod(null, null, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('personal_importRawKey');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(null);
    });
});
