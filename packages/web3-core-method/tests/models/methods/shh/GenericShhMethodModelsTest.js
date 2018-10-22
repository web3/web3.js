var chai = require('chai');
var expect = chai.expect;

var tests = [
    {
        model: 'AddPrivateKeyMethodModel',
        rpcMethod: 'shh_addPrivateKey',
        parametersAmount: 1
    },
    {
        model: 'AddSymKeyMethodModel',
        rpcMethod: 'shh_addSymKey',
        parametersAmount: 1
    },
    {
        model: 'DeleteKeyPairMethodModel',
        rpcMethod: 'shh_deleteKeyPair',
        parametersAmount: 1
    },
    {
        model: 'DeleteMessageFilterMethodModel',
        rpcMethod: 'shh_deleteMessageFilter',
        parametersAmount: 1
    },
    {
        model: 'DeleteSymKeyMethodModel',
        rpcMethod: 'shh_deleteSymKey',
        parametersAmount: 1
    },
    {
        model: 'GenerateSymKeyFromPasswordMethodModel',
        rpcMethod: 'shh_generateSymKeyFromPassword',
        parametersAmount: 1
    },
    {
        model: 'GetFilterMessagesMethodModel',
        rpcMethod: 'shh_getFilterMessages',
        parametersAmount: 1
    },
    {
        model: 'GetInfoMethodModel',
        rpcMethod: 'shh_info',
        parametersAmount: 0
    },
    {
        model: 'GetPrivateKeyMethodModel',
        rpcMethod: 'shh_getPrivateKey',
        parametersAmount: 1
    },
    {
        model: 'GetPublicKeyMethodModel',
        rpcMethod: 'shh_getPublicKey',
        parametersAmount: 1
    },
    {
        model: 'GetSymKeyMethodModel',
        rpcMethod: 'shh_getSymKey',
        parametersAmount: 1
    },
    {
        model: 'HasKeyPairMethodModel',
        rpcMethod: 'shh_hasKeyPair',
        parametersAmount: 1
    },
    {
        model: 'HasSymKeyMethodModel',
        rpcMethod: 'shh_hasSymKey',
        parametersAmount: 1
    },
    {
        model: 'MarkTrustedPeerMethodModel',
        rpcMethod: 'shh_markTrustedPeer',
        parametersAmount: 1
    },
    {
        model: 'NewKeyPairMethodModel',
        rpcMethod: 'shh_newKeyPair',
        parametersAmount: 1
    },
    {
        model: 'NewMessageFilterMethodModel',
        rpcMethod: 'shh_newMessageFilter',
        parametersAmount: 1
    },
    {
        model: 'NewSymKeyMethodModel',
        rpcMethod: 'shh_newSymKey',
        parametersAmount: 0
    },
    {
        model: 'PostMethodModel',
        rpcMethod: 'shh_post',
        parametersAmount: 1
    },
    {
        model: 'SetMaxMessageSizeMethodModel',
        rpcMethod: 'shh_setMaxMessageSize',
        parametersAmount: 1
    },
    {
        model: 'SetMinPoWMethodModel',
        rpcMethod: 'shh_setMinPoW',
        parametersAmount: 1
    },
    {
        model: 'ShhVersionMethodModel',
        rpcMethod: 'shh_version',
        parametersAmount: 0
    }
];

describe('GenericShhMethodModelsTest', function() {
    it('all models should have the correct properties set', function() {
        var model, testModel;
        tests.forEach(function(test) {
            testModel = require('../../../../src/models/methods/shh/' + test.model);
            model = new testModel({}, {});
            expect(model.rpcMethod).equal(test.rpcMethod);
            expect(model.parametersAmount).equal(test.parametersAmount);
        });
    });
});
