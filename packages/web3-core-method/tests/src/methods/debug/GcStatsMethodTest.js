import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GcStatsMethod from '../../../../src/methods/debug/GcStatsMethod';

/**
 * GcStatsMethod test
 */
describe('GcStatsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GcStatsMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_gcStats');

        expect(method.parametersAmount).toEqual(0);
    });
});
