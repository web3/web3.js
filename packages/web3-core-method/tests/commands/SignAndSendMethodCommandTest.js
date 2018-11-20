import * as sinonLib from 'sinon';
import SignAndSendMethodCommand from '../../src/commands/SignAndSendMethodCommand';
import TransactionSigner from '../../src/signers/TransactionSigner';
import TransactionConfirmationWorkflow from '../../src/workflows/TransactionConfirmationWorkflow';
import AbstractMethodModel from '../../lib/models/AbstractMethodModel';
import {WebsocketProvider, SocketProviderAdapter} from 'web3-providers';
import {AbstractWeb3Module} from 'web3-core';
import {PromiEvent} from 'web3-core-promievent';

const sinon = sinonLib.createSandbox();

/**
 * SendAndSignMethodCommand test
 */
describe('SendAndSignMethodCommandTest', () => {
    let signAndSendMethodCommand,
        provider,
        providerAdapter,
        providerAdapterMock,
        moduleInstance,
        methodModel,
        methodModelCallbackSpy,
        methodModelMock,
        promiEvent,
        promiEventEmitSpy,
        promiEventRemoveListenersSpy,
        transactionSigner,
        transactionSignerMock,
        transactionConfirmationWorkflow,
        transactionConfirmationWorkflowMock;

    beforeEach(() => {
        provider = new WebsocketProvider('ws://127.0.0.1', {});

        providerAdapter = new SocketProviderAdapter(provider);
        providerAdapterMock = sinon.mock(providerAdapter);

        moduleInstance = new AbstractWeb3Module(providerAdapter, {}, {}, {});

        methodModel = new AbstractMethodModel('', 0, {}, {});
        methodModelCallbackSpy = sinon.spy();
        methodModel.callback = methodModelCallbackSpy;
        methodModelMock = sinon.mock(methodModel);

        promiEvent = new PromiEvent();

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

    afterEach(() => {
        sinon.restore();
    });

    it('calls execute', () => {
        methodModel.parameters = [];

        methodModelMock
            .expects('beforeExecution')
            .withArgs(moduleInstance)
            .once();

        transactionSignerMock
            .expects('sign')
            .withArgs(methodModel.parameters[0], {})
            .returns(
                new Promise((resolve) => {
                    resolve({
                        rawTransaction: ''
                    });
                })
            )
            .once();

        providerAdapterMock
            .expects('send')
            .withArgs('eth_sendRawTransaction', [''])
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

        const returnedPromiEvent = signAndSendMethodCommand.execute(moduleInstance, methodModel, promiEvent, {});

        expect(returnedPromiEvent).toEqual(promiEvent);

        promiEvent.then(() => {
            expect(promiEventEmitSpy.calledOnce).toBeTruthy();
            expect(promiEventEmitSpy.calledWith('transactionHash', 'response')).toBeTruthy();

            expect(methodModelCallbackSpy.calledOnce).toBeTruthy();
            expect(methodModelCallbackSpy.calledWith(false, 'response')).toBeTruthy();

            expect(methodModel.rpcMethod).toBe('eth_sendRawTransaction');
            expect(methodModel.parameters[0]).toEqual({rawTransaction: ''});

            transactionConfirmationWorkflowMock.verify();
            providerAdapterMock.verify();
            methodModelMock.verify();
        });
    });

    it('calls execute and throws error', () => {
        methodModel.parameters = [{gasPrice: 100}];

        methodModelMock
            .expects('beforeExecution')
            .withArgs(moduleInstance)
            .once();

        transactionSignerMock
            .expects('sign')
            .withArgs(methodModel.parameters[0], {})
            .returns(
                new Promise((resolve, reject) => {
                    reject(new Error('error'));
                })
            )
            .once();

        const returnedPromiEvent = signAndSendMethodCommand.execute(moduleInstance, methodModel, promiEvent, {});

        expect(returnedPromiEvent).toEqual(promiEvent);

        promiEvent.catch((error) => {
            expect(promiEventRemoveListenersSpy.calledOnce).toBeTruthy();
            expect(promiEventEmitSpy.calledOnce).toBeTruthy();
            expect(promiEventEmitSpy.calledWith('error', 'error')).toBeTruthy();

            expect(methodModelCallbackSpy.calledOnce).toBeTruthy();
            expect(methodModelCallbackSpy.calledWith('error', null)).toBeTruthy();
            expect(error).toBeInstanceOf(Error);

            expect(methodModel.rpcMethod).toBe('eth_sendRawTransaction');

            transactionConfirmationWorkflowMock.verify();
            providerAdapterMock.verify();
            methodModelMock.verify();
        });
    });
});
