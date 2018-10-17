var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;

var SendMethodCommand = require('../../src/commands/SendMethodCommand');
var TransactionConfirmationWorkflow = require('../../src/workflows/TransactionConfirmationWorkflow');
var AbstractMethodModel = require('../../lib/models/AbstractMethodModel');
var ProvidersPackage = require('web3-providers');
var AbstractWeb3Module = require('web3-package').AbstractWeb3Module;
var PromiEvent = require('web3-core-promievent').PromiEvent;

/**
 * SendMethodCommand test
 */
describe('SendMethodCommandTest', function () {
    var sendMethodCommand,
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
        methodModelMock = sinon.mock(methodModel);

        promiEvent = new PromiEvent();
        promiEventMock = sinon.mock(promiEvent);

        transactionConfirmationWorkflow = new TransactionConfirmationWorkflow({}, {}, {}, {});
        transactionConfirmationWorkflowMock = sinon.mock(transactionConfirmationWorkflow);

        sendMethodCommand = new SendMethodCommand(transactionConfirmationWorkflow);
    });

    afterEach(function () {
        sinon.restore();
    });

    it('calls execute with gasPrice defined', function () {
        methodModel.parameters = [{gasPrice: 100}];
        methodModel.rpcMethod = 'eth_sendTransaction';

        methodModelMock
            .expects('beforeExecution')
            .withArgs(moduleInstance)
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
            .withArgs(methodModel, moduleInstance, 'response', promiEvent)
            .once();

        var returnedPromiEvent = sendMethodCommand.execute(moduleInstance, methodModel, promiEvent);

        expect(returnedPromiEvent).equal(promiEvent);

        promiEvent.eventEmitter.on('transactionHash', function () {
            transactionConfirmationWorkflowMock.verify();
            providerAdapterMock.verify();
            methodModelMock.verify();
        });
    });

    it('calls execute without gasPrice defined', function () {
        methodModel.parameters = [{}];
        methodModel.rpcMethod = 'eth_sendTransaction';

        methodModelMock
            .expects('beforeExecution')
            .withArgs(moduleInstance)
            .once();

        providerAdapterMock
            .expects('send')
            .withArgs('eth_gasPrice', [])
            .returns(new Promise(
                function (resolve) {
                    resolve(100);
                }
            ))
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
            .withArgs(methodModel, moduleInstance, 'response', promiEvent)
            .once();

        var returnedPromiEvent = sendMethodCommand.execute(moduleInstance, methodModel, promiEvent);

        expect(returnedPromiEvent).equal(promiEvent);

        promiEvent.eventEmitter.on('transactionHash', function (response) {
            expect(response).equal('response');
            expect(methodModel.parameters[0].gasPrice).equal(100);

            transactionConfirmationWorkflowMock.verify();
            providerAdapterMock.verify();
            methodModelMock.verify();
        });
    });

    it('calls execute and throws error', function () {
        methodModel.parameters = [{gasPrice: 100}];
        methodModel.rpcMethod = 'eth_sendTransaction';

        methodModelMock
            .expects('beforeExecution')
            .withArgs(moduleInstance)
            .once();

        providerAdapterMock
            .expects('send')
            .withArgs(methodModel.rpcMethod, methodModel.parameters)
            .returns(new Promise(
                function (resolve, reject) {
                    reject('error');
                }
            ))
            .once();

        promiEventMock
            .expects('reject')
            .withArgs('error')
            .once();

        var returnedPromiEvent = sendMethodCommand.execute(moduleInstance, methodModel, promiEvent);

        expect(returnedPromiEvent).equal(promiEvent);

        promiEvent.eventEmitter.on('error', function (error) {
            expect(error).equal('error');

            providerAdapterMock.verify();
            methodModelMock.verify();
            promiEventMock.verify();
        });
    });
});
