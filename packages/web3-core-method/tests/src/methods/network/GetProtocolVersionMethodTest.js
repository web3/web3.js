import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetProtocolVersionMethod from '../../../../src/methods/network/GetProtocolVersionMethod';

/**
 * GetProtocolVersionMethod test
 */
describe('GetProtocolVersionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetProtocolVersionMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_protocolVersion');

        expect(method.parametersAmount).toEqual(0);
    });

    it('afterExecution should map the response', () => {
        expect(method.afterExecution('0x0')).toEqual(100);
    });
});
