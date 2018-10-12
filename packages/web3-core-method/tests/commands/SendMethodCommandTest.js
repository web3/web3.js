var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;

var SendMethodCommand = require('../../src/commands/SendMethodCommand');
var TransactionConfirmationWorkflow = require('../../src/workflows/TransactionConfirmationWorkflow');
var AbstractMethodModel = require('../../lib/models/AbstractMethodModel');
var ProvidersPackage = require('web3-core-providers');
var AbstractWeb3Object = require('web3-core-package').AbstractWeb3Object;
var PromiEventPackage = require('web3-core-promievent');

/**
 * SendMethodCommand test
 */
describe('SendMethodCommandTest', function () {
    var sendMethodCommand,
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
        promiEventEmitSpy,
        promiEventRemoveListenersSpy,
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

        promiEventEmitSpy = sinon.spy();
        promiEvent.eventEmitter.emit = promiEventEmitSpy;

        promiEventRemoveListenersSpy = sinon.spy();
        promiEvent.eventEmitter.removeAllListeners = promiEventRemoveListenersSpy;

        transactionConfirmationWorkflow = new TransactionConfirmationWorkflow({},{},{},{});
        transactionConfirmationWorkflowMock = sinon.mock(transactionConfirmationWorkflow);

        sendMethodCommand = new SendMethodCommand(transactionConfirmationWorkflow);
    });

    afterEach(function () {
        sinon.restore();
    });

    it('calls execute with gasPrice defined', async function () {
        methodModel.parameters = [{gasPrice: 100}];
        methodModel.rpcMethod = 'eth_sendRawTransaction';

        methodModelMock
            .expects('beforeExecution')
            .withArgs(web3Package)
            .once();

        providerAdapterMock
            .expects('send')
            .withArgs(methodModel.rpcMethod, methodModel.parameters)
            .returns(new Promise(
                function (resolve) {
                    resolve('response');
                }
            ))
            .once();

        transactionConfirmationWorkflowMock
            .expects('execute')
            .withArgs(methodModel, web3Package, 'response', promiEvent)
            .once();


        var returnedPromiEvent = await sendMethodCommand.execute(web3Package, methodModel, promiEvent);

        expect(returnedPromiEvent).equal(promiEvent);

        expect(promiEventEmitSpy.calledOnce).to.be.true;
        expect(promiEventEmitSpy.calledWith('transactionHash', 'response')).to.be.true;

        expect(methodModelCallbackSpy.calledOnce).to.be.true;
        expect(methodModelCallbackSpy.calledWith(false, 'response')).to.be.true;

        transactionConfirmationWorkflowMock.verify();
        providerAdapterMock.verify();
        methodModelMock.verify();
    });

    it('calls execute without gasPrice defined', async function () {
        methodModel.parameters = [{}];
        methodModel.rpcMethod = 'eth_sendRawTransaction';

        methodModelMock
            .expects('beforeExecution')
            .withArgs(web3Package)
            .once();

        providerAdapterMock
            .expects('send')
            .withArgs('eth_gasPrice', [])
            .returns(new Promise(
                function (resolve) {
                    resolve(100);
                }
            )).once();

        providerAdapterMock
            .expects('send')
            .withArgs(methodModel.rpcMethod, methodModel.parameters)
            .returns(new Promise(
                function (resolve) {
                    resolve('response');
                }
            )).once();

        transactionConfirmationWorkflowMock
            .expects('execute')
            .withArgs(methodModel, web3Package, 'response', promiEvent)
            .once();

        var returnedPromiEvent = await sendMethodCommand.execute(web3Package, methodModel, promiEvent);

        expect(returnedPromiEvent).equal(promiEvent);

        promiEvent.eventEmitter.then(function () {
            transactionConfirmationWorkflowMock.verify();
            providerAdapterMock.verify();
            methodModelMock.verify();

            expect(promiEventEmitSpy.calledOnce).to.be.true;
            expect(promiEventEmitSpy.calledWith('transactionHash', 'response')).to.be.true;

            expect(methodModelCallbackSpy.calledOnce).to.be.true;
            expect(methodModelCallbackSpy.calledWith(false, 'response')).to.be.true;
        });

        expect(methodModel.parameters[0].gasPrice).equal(100);
    });
});
