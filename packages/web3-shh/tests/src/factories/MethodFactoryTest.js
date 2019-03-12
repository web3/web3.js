import {
    AddPrivateKeyMethod,
    AddSymKeyMethod,
    DeleteKeyPairMethod, DeleteMessageFilterMethod,
    DeleteSymKeyMethod,
    GenerateSymKeyFromPasswordMethod,
    GetFilterMessagesMethod,
    GetInfoMethod,
    GetPrivateKeyMethod,
    GetPublicKeyMethod,
    GetSymKeyMethod,
    HasKeyPairMethod,
    HasSymKeyMethod,
    MarkTrustedPeerMethod,
    NewKeyPairMethod,
    NewMessageFilterMethod,
    NewSymKeyMethod, PostMethod,
    SetMaxMessageSizeMethod,
    SetMinPoWMethod,
    ShhVersionMethod
} from 'web3-core-method';

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
        expect(methodFactory.methods).toEqual({
            getVersion: ShhVersionMethod,
            getInfo: GetInfoMethod,
            setMaxMessageSize: SetMaxMessageSizeMethod,
            setMinPoW: SetMinPoWMethod,
            markTrustedPeer: MarkTrustedPeerMethod,
            newKeyPair: NewKeyPairMethod,
            addPrivateKey: AddPrivateKeyMethod,
            deleteKeyPair: DeleteKeyPairMethod,
            hasKeyPair: HasKeyPairMethod,
            getPublicKey: GetPublicKeyMethod,
            getPrivateKey: GetPrivateKeyMethod,
            newSymKey: NewSymKeyMethod,
            addSymKey: AddSymKeyMethod,
            generateSymKeyFromPassword: GenerateSymKeyFromPasswordMethod,
            hasSymKey: HasSymKeyMethod,
            getSymKey: GetSymKeyMethod,
            deleteSymKey: DeleteSymKeyMethod,
            newMessageFilter: NewMessageFilterMethod,
            getFilterMessages: GetFilterMessagesMethod,
            deleteMessageFilter: DeleteMessageFilterMethod,
            post: PostMethod
        });
    });
});
