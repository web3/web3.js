import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetNodeInfoMethod from '../../../../src/methods/node/GetNodeInfoMethod';

/**
 * GetNodeInfoMethod test
 */
describe('GetNodeInfoMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetNodeInfoMethod(null, null, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('confluxWeb_clientVersion');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(null);
    });
});
