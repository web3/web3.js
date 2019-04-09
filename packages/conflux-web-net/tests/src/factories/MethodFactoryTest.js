import {GetBlockByNumberMethod, ListeningMethod, PeerCountMethod, VersionMethod} from 'conflux-web-core-method';
import MethodFactory from '../../../src/factories/MethodFactory';

/**
 * MethodFactory test
 */
describe('MethodFactoryTest', () => {
    let methodFactory;

    beforeEach(() => {
        methodFactory = new MethodFactory({}, {});
    });

    it('constructor check', () => {
        expect(methodFactory.utils).toEqual({});

        expect(methodFactory.formatters).toEqual({});
    });

    it('JSON-RPC methods check', () => {
        expect(methodFactory.methods).toEqual({
            getId: VersionMethod,
            getBlockByNumber: GetBlockByNumberMethod,
            isListening: ListeningMethod,
            getPeerCount: PeerCountMethod
        });
    });
});
