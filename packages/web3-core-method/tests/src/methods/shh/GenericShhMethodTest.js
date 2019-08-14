import AddPrivateKeyMethod from '../../../../src/methods/shh/AddPrivateKeyMethod';
import AddSymKeyMethod from '../../../../src/methods/shh/AddSymKeyMethod';
import DeleteKeyPairMethod from '../../../../src/methods/shh/DeleteKeyPairMethod';
import DeleteMessageFilterMethod from '../../../../src/methods/shh/DeleteMessageFilterMethod';
import DeleteSymKeyMethod from '../../../../src/methods/shh/DeleteSymKeyMethod';
import GenerateSymKeyFromPasswordMethod from '../../../../src/methods/shh/GenerateSymKeyFromPasswordMethod';
import GetFilterMessagesMethod from '../../../../src/methods/shh/GetFilterMessagesMethod';
import GetInfoMethod from '../../../../src/methods/shh/GetInfoMethod';
import GetPrivateKeyMethod from '../../../../src/methods/shh/GetPrivateKeyMethod';
import GetPublicKeyMethod from '../../../../src/methods/shh/GetPublicKeyMethod';
import GetSymKeyMethod from '../../../../src/methods/shh/GetSymKeyMethod';
import HasKeyPairMethod from '../../../../src/methods/shh/HasKeyPairMethod';
import HasSymKeyMethod from '../../../../src/methods/shh/HasSymKeyMethod';
import MarkTrustedPeerMethod from '../../../../src/methods/shh/MarkTrustedPeerMethod';
import NewKeyPairMethod from '../../../../src/methods/shh/NewKeyPairMethod';
import NewMessageFilterMethod from '../../../../src/methods/shh/NewMessageFilterMethod';
import NewSymKeyMethod from '../../../../src/methods/shh/NewSymKeyMethod';
import PostMethod from '../../../../src/methods/shh/PostMethod';
import SetMaxMessageSizeMethod from '../../../../src/methods/shh/SetMaxMessageSizeMethod';
import SetMinPoWMethod from '../../../../src/methods/shh/SetMinPoWMethod';
import ShhVersionMethod from '../../../../src/methods/shh/ShhVersionMethod';

const tests = [
    {
        method: AddPrivateKeyMethod,
        rpcMethod: 'shh_addPrivateKey',
        parametersAmount: 1
    },
    {
        method: AddSymKeyMethod,
        rpcMethod: 'shh_addSymKey',
        parametersAmount: 1
    },
    {
        method: DeleteKeyPairMethod,
        rpcMethod: 'shh_deleteKeyPair',
        parametersAmount: 1
    },
    {
        method: DeleteMessageFilterMethod,
        rpcMethod: 'shh_deleteMessageFilter',
        parametersAmount: 1
    },
    {
        method: DeleteSymKeyMethod,
        rpcMethod: 'shh_deleteSymKey',
        parametersAmount: 1
    },
    {
        method: GenerateSymKeyFromPasswordMethod,
        rpcMethod: 'shh_generateSymKeyFromPassword',
        parametersAmount: 1
    },
    {
        method: GetFilterMessagesMethod,
        rpcMethod: 'shh_getFilterMessages',
        parametersAmount: 1
    },
    {
        method: GetInfoMethod,
        rpcMethod: 'shh_info',
        parametersAmount: 0
    },
    {
        method: GetPrivateKeyMethod,
        rpcMethod: 'shh_getPrivateKey',
        parametersAmount: 1
    },
    {
        method: GetPublicKeyMethod,
        rpcMethod: 'shh_getPublicKey',
        parametersAmount: 1
    },
    {
        method: GetSymKeyMethod,
        rpcMethod: 'shh_getSymKey',
        parametersAmount: 1
    },
    {
        method: HasKeyPairMethod,
        rpcMethod: 'shh_hasKeyPair',
        parametersAmount: 1
    },
    {
        method: HasSymKeyMethod,
        rpcMethod: 'shh_hasSymKey',
        parametersAmount: 1
    },
    {
        method: MarkTrustedPeerMethod,
        rpcMethod: 'shh_markTrustedPeer',
        parametersAmount: 1
    },
    {
        method: NewKeyPairMethod,
        rpcMethod: 'shh_newKeyPair',
        parametersAmount: 0
    },
    {
        method: NewMessageFilterMethod,
        rpcMethod: 'shh_newMessageFilter',
        parametersAmount: 1
    },
    {
        method: NewSymKeyMethod,
        rpcMethod: 'shh_newSymKey',
        parametersAmount: 0
    },
    {
        method: PostMethod,
        rpcMethod: 'shh_post',
        parametersAmount: 1
    },
    {
        method: SetMaxMessageSizeMethod,
        rpcMethod: 'shh_setMaxMessageSize',
        parametersAmount: 1
    },
    {
        method: SetMinPoWMethod,
        rpcMethod: 'shh_setMinPoW',
        parametersAmount: 1
    },
    {
        method: ShhVersionMethod,
        rpcMethod: 'shh_version',
        parametersAmount: 0
    }
];

describe('GenericShhMethodsTest', () => {
    it('all methods should have the correct properties set', () => {
        let method;
        tests.forEach((test) => {
            // eslint-disable-next-line new-cap
            method = new test.method({});

            expect(method.rpcMethod).toEqual(test.rpcMethod);

            expect(method.parametersAmount).toEqual(test.parametersAmount);
        });
    });
});
