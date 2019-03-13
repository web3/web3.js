import {GetBlockMethod, ListeningMethod, PeerCountMethod, VersionMethod} from 'web3-core-method';
import MethodFactory from '../../../src/factories/MethodFactory';

// Mocks
jest.mock('');

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
            getBlock: GetBlockMethod,
            isListening: ListeningMethod,
            getPeerCount: PeerCountMethod
        });
    });
});
