import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetTxpoolContentMethod from '../../../../src/methods/txpool/GetTxpoolContentMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * GetTxpoolContentMethod test
 */
describe('GetTxpoolContentMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetTxpoolContentMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('txpool_content');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
