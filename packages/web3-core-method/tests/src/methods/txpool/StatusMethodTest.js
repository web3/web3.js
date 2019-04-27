import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StatusMethod from '../../../../src/methods/txpool/StatusMethod';

/**
 * StatusMethod test
 */
describe('StatusMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StatusMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('txpool_status');

        expect(method.parametersAmount).toEqual(0);
    });
});
