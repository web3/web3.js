import {GetBlockByNumberMethod, ListeningMethod, PeerCountMethod, VersionMethod} from 'web3-core-method';
import MethodFactory from '../../../src/factories/MethodFactory';

/**
 * MethodFactory test
 */
describe('MethodFactoryTest', () => {
    let methodFactory;

    beforeEach(() => {
        methodFactory = new MethodFactory();
    });

    it('constructor check', () => {
        expect(methodFactory.methods).toEqual({
            getId: VersionMethod,
            getBlockByNumber: GetBlockByNumberMethod,
            isListening: ListeningMethod,
            getPeerCount: PeerCountMethod
        });
    });
});
