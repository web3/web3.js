import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StopWsMethod from '../../../../src/methods/admin/StopWsMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * StopWsMethod test
 */
describe('StopWsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StopWsMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_stopWS');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
