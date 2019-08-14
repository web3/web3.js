import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StatusMethod from '../../../../src/methods/txpool/StatusMethod';

/**
 * StatusMethod test
 */
describe('StatusMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StatusMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('txpool_status');

        expect(method.parametersAmount).toEqual(0);
    });

    it('calls afterExecution and returns the expected object', () => {
        expect(method.afterExecution({pending: '0x1', queued: '0x1'})).toEqual({pending: 1, queued: 1});
    });
});
