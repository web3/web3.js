import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StatusMethod from '../../../../src/methods/txpool/StatusMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * StatusMethod test
 */
describe('StatusMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StatusMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('txpool_status');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
