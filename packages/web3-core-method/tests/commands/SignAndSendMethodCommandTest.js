var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;

var SignAndSendMethodCommand = require('../../src/commands/SignAndSendMethodCommand');
var TransactionSigner = require('../../src/signers/TransactionSigner');
var TransactionConfirmationWorkflow = require('../../src/workflows/TransactionConfirmationWorkflow');
var AbstractMethodModel = require('../../lib/models/AbstractMethodModel');
var ProvidersPackage = require('web3-core-providers');
var AbstractWeb3Object = require('web3-core-package').AbstractWeb3Object;
var PromiEventPackage = require('web3-core-promievent');

/**
 * SendAndSignMethodCommand test
 */
describe('SendAndSignMethodCommandTest', function () {
    var signAndSendMethodCommand,
        provider,
        providerMock,
        providerAdapter,
        providerAdapterMock,
        web3Package,
        web3PackageMock,
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

        web3Package = new AbstractWeb3Object(providerAdapter, ProvidersPackage, null, null);
        web3PackageMock = sinon.mock(web3Package);

        methodModel = new AbstractMethodModel('', 0, {}, {});
        methodModelCallbackSpy = sinon.spy();
        methodModel.callback = methodModelCallbackSpy;
        methodModelMock = sinon.mock(methodModel);

        promiEvent = PromiEventPackage.createPromiEvent();
        promiEventMock = sinon.mock(promiEvent);

        promiEventEmitSpy = sinon.spy();
        promiEvent.eventEmitter.emit = promiEventEmitSpy;

        promiEventRemoveListenersSpy = sinon.spy();
        promiEvent.eventEmitter.removeAllListeners = promiEventRemoveListenersSpy;

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
            .withArgs(web3Package)
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
            .withArgs(methodModel, web3Package, 'response', promiEvent)
            .once();

        var returnedPromiEvent = signAndSendMethodCommand.execute(methodModel, web3Package, {}, promiEvent);

        expect(returnedPromiEvent).equal(promiEvent);

        promiEvent.eventEmitter.then(function () {
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
            .withArgs(web3Package)
            .once();

        transactionSignerMock
            .expects('sign')
            .withArgs(methodModel.parameters[0], {})
            .returns(new Promise(function (resolve, reject) {
                reject('error')
            }))
            .once();

        var returnedPromiEvent = signAndSendMethodCommand.execute(methodModel, web3Package, {}, promiEvent);

        expect(returnedPromiEvent).equal(promiEvent);

        promiEvent.eventEmitter.catch(function (error) {
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
