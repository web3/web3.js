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
describe('SendMethodCommandTest', () => {
    let sendMethodCommand,
        provider,
        providerAdapter,
        providerAdapterMock,
        moduleInstance,
        methodModel,
        methodModelMock,
        promiEvent,
        promiEventMock,
        transactionConfirmationWorkflow,
        transactionConfirmationWorkflowMock;

    beforeEach(() => {
        provider = new WebsocketProvider('ws://127.0.0.1', {});

        providerAdapter = new SocketProviderAdapter(provider);
        providerAdapterMock = sinon.mock(providerAdapter);

        moduleInstance = new AbstractWeb3Module(providerAdapter, {}, {}, {});

        methodModel = new AbstractMethodModel('', 0, {}, {});
        methodModelMock = sinon.mock(methodModel);

        promiEvent = new PromiEvent();
        promiEventMock = sinon.mock(promiEvent);

        transactionConfirmationWorkflow = new TransactionConfirmationWorkflow({}, {}, {}, {});
        transactionConfirmationWorkflowMock = sinon.mock(transactionConfirmationWorkflow);

        sendMethodCommand = new SendMethodCommand(transactionConfirmationWorkflow);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('calls execute with gasPrice defined', () => {
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
                new Promise((resolve) => {
                    resolve('response');
                })
            )
            .once();

        transactionConfirmationWorkflowMock
            .expects('execute')
            .withArgs(methodModel, moduleInstance, 'response', promiEvent)
            .once();

        const returnedPromiEvent = sendMethodCommand.execute(moduleInstance, methodModel, promiEvent);

        expect(returnedPromiEvent).toEqual(promiEvent);

        promiEvent.on('transactionHash', () => {
            transactionConfirmationWorkflowMock.verify();
            providerAdapterMock.verify();
            methodModelMock.verify();
        });
    });

    it('calls execute without gasPrice defined', () => {
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
                new Promise((resolve) => {
                    resolve(100);
                })
            )
            .once();

        providerAdapterMock
            .expects('send')
            .withArgs(methodModel.rpcMethod, methodModel.parameters)
            .returns(
                new Promise((resolve) => {
                    resolve('response');
                })
            )
            .once();

        transactionConfirmationWorkflowMock
            .expects('execute')
            .withArgs(methodModel, moduleInstance, 'response', promiEvent)
            .once();

        const returnedPromiEvent = sendMethodCommand.execute(moduleInstance, methodModel, promiEvent);

        expect(returnedPromiEvent).toEqual(promiEvent);

        promiEvent.on('transactionHash', (response) => {
            expect(response).toBe('response');
            expect(methodModel.parameters[0].gasPrice).toBe(100);

            transactionConfirmationWorkflowMock.verify();
            providerAdapterMock.verify();
            methodModelMock.verify();
        });
    });

    it('calls execute and throws error', () => {
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
                new Promise((resolve, reject) => {
                    reject(new Error('error'));
                })
            )
            .once();

        promiEventMock
            .expects('reject')
            .withArgs('error')
            .once();

        const returnedPromiEvent = sendMethodCommand.execute(moduleInstance, methodModel, promiEvent);

        expect(returnedPromiEvent).toEqual(promiEvent);

        promiEvent.on('error', (error) => {
            expect(error).toBeInstanceOf(Error);

            providerAdapterMock.verify();
            methodModelMock.verify();
            promiEventMock.verify();
        });
    });
});
