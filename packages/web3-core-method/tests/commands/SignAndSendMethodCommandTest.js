var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;

var SignAndSendMethodCommand = require('../../src/commands/SignAndSendMethodCommand');
var TransactionSigner = require('../../src/signers/TransactionSigner');
var TransactionConfirmationWorkflow = require('../../src/workflows/TransactionConfirmationWorkflow');
var AbstractMethodModel = require('../../lib/models/AbstractMethodModel');
var ProvidersPackage = require('web3-providers');
var AbstractWeb3Module = require('web3-core').AbstractWeb3Module;
var PromiEvent = require('web3-core-promievent').PromiEvent;

/**
 * SendAndSignMethodCommand test
 */
describe('SendAndSignMethodCommandTest', function () {
    var signAndSendMethodCommand,
        provider,
        providerMock,
        providerAdapter,
        providerAdapterMock,
        moduleInstance,
        moduleInstanceMock,
        methodModel,
        methodModelCallbackSpy,
        methodModelMock,
        promiEvent,
        promiEventMock,
        promiEventEmitSpy,
        promiEventRemoveListenersSpy,
        transactionSigner,
        transactionSignerMock,
        transactionConfirmationWorkflow,
        transactionConfirmationWorkflowMock;

    beforeEach(function () {
        provider = new ProvidersPackage.WebsocketProvider('ws://127.0.0.1', {});
        providerMock = sinon.mock(provider);

        providerAdapter = new ProvidersPackage.SocketProviderAdapter(provider);
        providerAdapterMock = sinon.mock(providerAdapter);

        moduleInstance = new AbstractWeb3Module(providerAdapter, ProvidersPackage, null, null);
        moduleInstanceMock = sinon.mock(moduleInstance);

        methodModel = new AbstractMethodModel('', 0, {}, {});
        methodModelCallbackSpy = sinon.spy();
        methodModel.callback = methodModelCallbackSpy;
        methodModelMock = sinon.mock(methodModel);

        promiEvent = new PromiEvent();
        promiEventMock = sinon.mock(promiEvent);

        promiEventEmitSpy = sinon.spy();
        promiEvent.emit = promiEventEmitSpy;

        promiEventRemoveListenersSpy = sinon.spy();
        promiEvent.removeAllListeners = promiEventRemoveListenersSpy;

        transactionConfirmationWorkflow = new TransactionConfirmationWorkflow({}, {}, {}, {});
        transactionConfirmationWorkflowMock = sinon.mock(transactionConfirmationWorkflow);

        transactionSigner = new TransactionSigner();
        transactionSignerMock = sinon.mock(transactionSigner);

        signAndSendMethodCommand = new SignAndSendMethodCommand(transactionConfirmationWorkflow, transactionSigner);
    });

    afterEach(function () {
        sinon.restore();
    });

    it('calls execute', function () {
        methodModel.parameters = [];

        methodModelMock
            .expects('beforeExecution')
            .withArgs(moduleInstance)
            .once();

        transactionSignerMock
            .expects('sign')
            .withArgs(methodModel.parameters[0], {})
            .returns(new Promise(function (resolve) {
                resolve({
                    rawTransaction: ''
                })
            }))
            .once();

        providerAdapterMock
            .expects('send')
            .withArgs('eth_sendRawTransaction', [''])
            .returns(new Promise(
                function (resolve) {
                    resolve('response');
                }
            )).once();

        transactionConfirmationWorkflowMock
            .expects('execute')
            .withArgs(methodModel, moduleInstance, 'response', promiEvent)
            .once();

        var returnedPromiEvent = signAndSendMethodCommand.execute(moduleInstance, methodModel, promiEvent, {});

        expect(returnedPromiEvent).equal(promiEvent);

        promiEvent.then(function () {
            expect(promiEventEmitSpy.calledOnce).to.be.true;
            expect(promiEventEmitSpy.calledWith('transactionHash', 'response')).to.be.true;

            expect(methodModelCallbackSpy.calledOnce).to.be.true;
            expect(methodModelCallbackSpy.calledWith(false, 'response')).to.be.true;

            expect(methodModel.rpcMethod).equal('eth_sendRawTransaction');
            expect(methodModel.parameters[0]).equal({rawTransaction: ''});

            transactionConfirmationWorkflowMock.verify();
            providerAdapterMock.verify();
            methodModelMock.verify();
        });
    });

    it('calls execute and throws error', function () {
        methodModel.parameters = [{gasPrice: 100}];

        methodModelMock
            .expects('beforeExecution')
            .withArgs(moduleInstance)
            .once();

        transactionSignerMock
            .expects('sign')
            .withArgs(methodModel.parameters[0], {})
            .returns(new Promise(function (resolve, reject) {
                reject('error')
            }))
            .once();

        var returnedPromiEvent = signAndSendMethodCommand.execute(moduleInstance, methodModel, promiEvent, {});

        expect(returnedPromiEvent).equal(promiEvent);

        promiEvent.catch(function (error) {
            expect(promiEventRemoveListenersSpy.calledOnce).to.be.true;
            expect(promiEventEmitSpy.calledOnce).to.be.true;
            expect(promiEventEmitSpy.calledWith('error', 'error')).to.be.true;

            expect(methodModelCallbackSpy.calledOnce).to.be.true;
            expect(methodModelCallbackSpy.calledWith('error', null)).to.be.true;
            expect(error).equal('error');

            expect(methodModel.rpcMethod).equal('eth_sendRawTransaction');

            transactionConfirmationWorkflowMock.verify();
            providerAdapterMock.verify();
            methodModelMock.verify();
        });
    });
});
