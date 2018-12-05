import AddPrivateKeyMethodModel from '../../../../src/models/methods/shh/AddPrivateKeyMethodModel';
import AddSymKeyMethodModel from '../../../../src/models/methods/shh/AddSymKeyMethodModel';
import DeleteKeyPairMethodModel from '../../../../src/models/methods/shh/DeleteKeyPairMethodModel';
import DeleteMessageFilterMethodModel from '../../../../src/models/methods/shh/DeleteMessageFilterMethodModel';
import DeleteSymKeyMethodModel from '../../../../src/models/methods/shh/DeleteSymKeyMethod';
import GenerateSymKeyFromPasswordMethodModel from '../../../../src/models/methods/shh/GenerateSymKeyFromPasswordMethodModel';
import GetFilterMessagesMethodModel from '../../../../src/models/methods/shh/GetFilterMessagesMethodModel';
import GetInfoMethodModel from '../../../../src/models/methods/shh/GetInfoMethod';
import GetPrivateKeyMethodModel from '../../../../src/models/methods/shh/GetPrivateKeyMethodModel';
import GetPublicKeyMethodModel from '../../../../src/models/methods/shh/GetPublicKeyMethodModel';
import GetSymKeyMethodModel from '../../../../src/models/methods/shh/GetSymKeyMethodModel';
import HasKeyPairMethodModel from '../../../../src/models/methods/shh/HasKeyPairMethodModel';
import HasSymKeyMethodModel from '../../../../src/models/methods/shh/HasSymKeyMethodModel';
import MarkTrustedPeerMethodModel from '../../../../src/models/methods/shh/MarkTrustedPeerMethodModel';
import NewKeyPairMethodModel from '../../../../src/models/methods/shh/NewKeyPairMethodModel';
import NewMessageFilterMethodModel from '../../../../src/models/methods/shh/NewMessageFilterMethodModel';
import NewSymKeyMethodModel from '../../../../src/models/methods/shh/NewSymKeyMethodModel';
import PostMethodModel from '../../../../src/models/methods/shh/PostMethodModel';
import SetMaxMessageSizeMethodModel from '../../../../src/models/methods/shh/SetMaxMessageSizeMethodModel';
import SetMinPoWMethodModel from '../../../../src/models/methods/shh/SetMinPoWMethodModel';
import ShhVersionMethodModel from '../../../../src/models/methods/shh/ShhVersionMethodModel';

const tests = [
    {
        model: AddPrivateKeyMethodModel,
        rpcMethod: 'shh_addPrivateKey',
        parametersAmount: 1
    },
    {
        model: AddSymKeyMethodModel,
        rpcMethod: 'shh_addSymKey',
        parametersAmount: 1
    },
    {
        model: DeleteKeyPairMethodModel,
        rpcMethod: 'shh_deleteKeyPair',
        parametersAmount: 1
    },
    {
        model: DeleteMessageFilterMethodModel,
        rpcMethod: 'shh_deleteMessageFilter',
        parametersAmount: 1
    },
    {
        model: DeleteSymKeyMethodModel,
        rpcMethod: 'shh_deleteSymKey',
        parametersAmount: 1
    },
    {
        model: GenerateSymKeyFromPasswordMethodModel,
        rpcMethod: 'shh_generateSymKeyFromPassword',
        parametersAmount: 1
    },
    {
        model: GetFilterMessagesMethodModel,
        rpcMethod: 'shh_getFilterMessages',
        parametersAmount: 1
    },
    {
        model: GetInfoMethodModel,
        rpcMethod: 'shh_info',
        parametersAmount: 0
    },
    {
        model: GetPrivateKeyMethodModel,
        rpcMethod: 'shh_getPrivateKey',
        parametersAmount: 1
    },
    {
        model: GetPublicKeyMethodModel,
        rpcMethod: 'shh_getPublicKey',
        parametersAmount: 1
    },
    {
        model: GetSymKeyMethodModel,
        rpcMethod: 'shh_getSymKey',
        parametersAmount: 1
    },
    {
        model: HasKeyPairMethodModel,
        rpcMethod: 'shh_hasKeyPair',
        parametersAmount: 1
    },
    {
        model: HasSymKeyMethodModel,
        rpcMethod: 'shh_hasSymKey',
        parametersAmount: 1
    },
    {
        model: MarkTrustedPeerMethodModel,
        rpcMethod: 'shh_markTrustedPeer',
        parametersAmount: 1
    },
    {
        model: NewKeyPairMethodModel,
        rpcMethod: 'shh_newKeyPair',
        parametersAmount: 1
    },
    {
        model: NewMessageFilterMethodModel,
        rpcMethod: 'shh_newMessageFilter',
        parametersAmount: 1
    },
    {
        model: NewSymKeyMethodModel,
        rpcMethod: 'shh_newSymKey',
        parametersAmount: 0
    },
    {
        model: PostMethodModel,
        rpcMethod: 'shh_post',
        parametersAmount: 1
    },
    {
        model: SetMaxMessageSizeMethodModel,
        rpcMethod: 'shh_setMaxMessageSize',
        parametersAmount: 1
    },
    {
        model: SetMinPoWMethodModel,
        rpcMethod: 'shh_setMinPoW',
        parametersAmount: 1
    },
    {
        model: ShhVersionMethodModel,
        rpcMethod: 'shh_version',
        parametersAmount: 0
    }
];

describe('GenericShhMethodModelsTest', () => {
    it('all models should have the correct properties set', () => {
        let model;
        tests.forEach((test) => {
            // eslint-disable-next-line new-cap
            model = new test.model({}, {});

            expect(model.rpcMethod)
                .toBe(test.rpcMethod);

            expect(model.parametersAmount)
                .toBe(test.parametersAmount);
        });
    });
});
