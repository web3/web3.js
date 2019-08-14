import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import VersionMethod from '../../../../src/methods/network/VersionMethod';

/**
 * VersionMethod test
 */
describe('VersionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new VersionMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('net_version');

        expect(method.parametersAmount).toEqual(0);
    });

    it('afterExecution should map the response', () => {
        expect(method.afterExecution('0x0')).toEqual(100);
    });
});
