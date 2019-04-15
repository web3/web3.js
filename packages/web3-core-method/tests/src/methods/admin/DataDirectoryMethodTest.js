import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import DataDirectoryMethod from '../../../../src/methods/admin/DataDirectoryMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * DataDirectoryMethod test
 */
describe('DataDirectoryMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new DataDirectoryMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_datadir');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
