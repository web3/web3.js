import * as sinonLib from 'sinon';
import SendMethodCommand from '../../src/commands/SendMethodCommand';
import TransactionConfirmationWorkflow from '../../src/workflows/TransactionConfirmationWorkflow';
import AbstractMethodModel from '../../lib/models/AbstractMethodModel';
import {WebsocketProvider, SocketProviderAdapter} from 'web3-providers';
import {AbstractWeb3Module} from 'web3-core';
import {PromiEvent} from 'web3-core-promievent';
const sinon = sinonLib.createSandbox();

/**
 * SendMethodCommand test
 */
describe('SendMethodCommandTest', function() {
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

    beforeEach(function() {
        provider = new WebsocketProvider('ws://127.0.0.1', {});
        providerMock = sinon.mock(provider);

        providerAdapter = new SocketProviderAdapter(provider);
        providerAdapterMock = sinon.mock(providerAdapter);

        moduleInstance = new AbstractWeb3Module(providerAdapter, {}, {}, {});
        moduleInstanceMock = sinon.mock(moduleInstance);

        methodModel = new AbstractMethodModel('', 0, {}, {});
        methodModelMock = sinon.mock(methodModel);

        promiEvent = new PromiEvent();
        promiEventMock = sinon.mock(promiEvent);

        transactionConfirmationWorkflow = new TransactionConfirmationWorkflow({}, {}, {}, {});
        transactionConfirmationWorkflowMock = sinon.mock(transactionConfirmationWorkflow);

        sendMethodCommand = new SendMethodCommand(transactionConfirmationWorkflow);
    });

    afterEach(function() {
        sinon.restore();
    });

    it('calls execute with gasPrice defined', function() {
        methodModel.parameters = [{gasPrice: 100}];
        methodModel.rpcMethod = 'eth_sendTransaction';

        methodModelMock
            .expects('beforeExecution')
            .withArgs(moduleInstance)
            .once();

        providerAdapterMock
            .expects('send')
            .withArgs(methodModel.rpcMethod, methodModel.parameters)
            .returns(
                new Promise(function(resolve) {
                    resolve('response');
                })
            )
            .once();

        transactionConfirmationWorkflowMock
            .expects('execute')
            .withArgs(methodModel, moduleInstance, 'response', promiEvent)
            .once();

        var returnedPromiEvent = sendMethodCommand.execute(moduleInstance, methodModel, promiEvent);

        expect(returnedPromiEvent).equal(promiEvent);

        promiEvent.on('transactionHash', function() {
            transactionConfirmationWorkflowMock.verify();
            providerAdapterMock.verify();
            methodModelMock.verify();
        });
    });

    it('calls execute without gasPrice defined', function() {
        methodModel.parameters = [{}];
        methodModel.rpcMethod = 'eth_sendTransaction';

        methodModelMock
            .expects('beforeExecution')
            .withArgs(moduleInstance)
            .once();

        providerAdapterMock
            .expects('send')
            .withArgs('eth_gasPrice', [])
            .returns(
                new Promise(function(resolve) {
                    resolve(100);
                })
            )
            .once();

        providerAdapterMock
            .expects('send')
            .withArgs(methodModel.rpcMethod, methodModel.parameters)
            .returns(
                new Promise(function(resolve) {
                    resolve('response');
                })
            )
            .once();

        transactionConfirmationWorkflowMock
            .expects('execute')
            .withArgs(methodModel, moduleInstance, 'response', promiEvent)
            .once();

        var returnedPromiEvent = sendMethodCommand.execute(moduleInstance, methodModel, promiEvent);

        expect(returnedPromiEvent).equal(promiEvent);

        promiEvent.on('transactionHash', function(response) {
            expect(response).equal('response');
            expect(methodModel.parameters[0].gasPrice).equal(100);

            transactionConfirmationWorkflowMock.verify();
            providerAdapterMock.verify();
            methodModelMock.verify();
        });
    });

    it('calls execute and throws error', function() {
        methodModel.parameters = [{gasPrice: 100}];
        methodModel.rpcMethod = 'eth_sendTransaction';

        methodModelMock
            .expects('beforeExecution')
            .withArgs(moduleInstance)
            .once();

        providerAdapterMock
            .expects('send')
            .withArgs(methodModel.rpcMethod, methodModel.parameters)
            .returns(
                new Promise(function(resolve, reject) {
                    reject('error');
                })
            )
            .once();

        promiEventMock
            .expects('reject')
            .withArgs('error')
            .once();

        var returnedPromiEvent = sendMethodCommand.execute(moduleInstance, methodModel, promiEvent);

        expect(returnedPromiEvent).equal(promiEvent);

        promiEvent.on('error', function(error) {
            expect(error).equal('error');

            providerAdapterMock.verify();
            methodModelMock.verify();
            promiEventMock.verify();
        });
    });
});
