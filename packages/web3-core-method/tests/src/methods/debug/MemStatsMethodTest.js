import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import MemStatsMethod from '../../../../src/methods/debug/MemStatsMethod';

/**
 * MemStatsMethod test
 */
describe('MemStatsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new MemStatsMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_memStats');

        expect(method.parametersAmount).toEqual(0);
    });
});
