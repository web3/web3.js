import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import DataDirectoryMethod from '../../../../src/methods/admin/DataDirectoryMethod';

/**
 * DataDirectoryMethod test
 */
describe('DataDirectoryMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new DataDirectoryMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_datadir');

        expect(method.parametersAmount).toEqual(0);
    });
});
