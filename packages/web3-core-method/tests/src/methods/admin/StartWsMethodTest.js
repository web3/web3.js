import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StartWsMethod from '../../../../src/methods/admin/StartWsMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * StartWsMethod test
 */
describe('StartWsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StartWsMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_startWS');

        expect(method.parametersAmount).toEqual(4);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
