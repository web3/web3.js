import * as Utils from 'web3-utils';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetProtocolVersionMethod from '../../../../src/methods/network/GetProtocolVersionMethod';

// Mocks
jest.mock('web3-utils');

/**
 * GetProtocolVersionMethod test
 */
describe('GetProtocolVersionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetProtocolVersionMethod(Utils, null, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_protocolVersion');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(Utils);

        expect(method.formatters).toEqual(null);
    });

    it('afterExecution should map the response', () => {
        Utils.hexToNumber.mockReturnValueOnce(100);

        expect(method.afterExecution('0x0')).toEqual(100);

        expect(Utils.hexToNumber).toHaveBeenCalledWith('0x0');
    });
});
