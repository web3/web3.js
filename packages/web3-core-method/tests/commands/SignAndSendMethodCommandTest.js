import SignAndSendMethodCommand from '../../src/commands/SignAndSendMethodCommand';
import TransactionSigner from '../../src/signers/TransactionSigner';
import TransactionConfirmationWorkflow from '../../src/workflows/TransactionConfirmationWorkflow';
import AbstractMethodModel from '../../lib/models/AbstractMethodModel';
import {SocketProviderAdapter} from 'web3-providers';
import {AbstractWeb3Module} from 'web3-core';
import {PromiEvent} from 'web3-core-promievent';

// Mocks
jest.mock('../../src/workflows/TransactionConfirmationWorkflow');
jest.mock('../../src/signers/TransactionSigner');
jest.mock('SocketProviderAdapter');
jest.mock('../../lib/models/AbstractMethodModel');
jest.mock('AbstractWeb3Module');

/**
 * SendAndSignMethodCommand test
 */
describe('SendAndSignMethodCommandTest', () => {
    let signAndSendMethodCommand,
        providerAdapter,
        providerAdapterMock,
        moduleInstance,
        moduleInstanceMock,
        methodModel,
        methodModelMock,
        promiEvent,
        transactionSigner,
        transactionSignerMock,
        transactionConfirmationWorkflow,
        transactionConfirmationWorkflowMock;

    beforeEach(() => {
        providerAdapter = new SocketProviderAdapter({});
        providerAdapterMock = SocketProviderAdapter.mock.instances[0];

        moduleInstance = new AbstractWeb3Module(providerAdapter, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];

        methodModel = new AbstractMethodModel('', 0, {}, {});
        methodModelMock = AbstractMethodModel.mock.instances[0];

        promiEvent = new PromiEvent();

        transactionConfirmationWorkflow = new TransactionConfirmationWorkflow({}, {}, {});
        transactionConfirmationWorkflowMock = TransactionConfirmationWorkflow.mock.instances[0];

        transactionSigner = new TransactionSigner();
        transactionSignerMock = TransactionSigner.mock.instances[0];
    });

    it('constructor has been called and the properties are aet', () => {
        signAndSendMethodCommand = new SignAndSendMethodCommand(
            transactionConfirmationWorkflowMock,
            transactionSignerMock
        );

        expect(signAndSendMethodCommand.transactionConfirmationWorkflow)
            .toEqual(transactionConfirmationWorkflowMock);

        expect(signAndSendMethodCommand.transactionSigner)
            .toEqual(transactionSignerMock);
    });

    it('calls execute', (done) => {
        methodModelMock.parameters = [''];
        methodModelMock.callback = (error, response) => {
            expect(error).toBe(false);
            expect(response).toBe('response');

            done();
        };

        transactionSignerMock.sign
            .mockReturnValueOnce(Promise.resolve({rawTransaction: ''}));

        providerAdapterMock.send
            .mockReturnValueOnce(Promise.resolve('response'));

        moduleInstance.currentProvider = providerAdapterMock;

        signAndSendMethodCommand = new SignAndSendMethodCommand(
            transactionConfirmationWorkflowMock,
            transactionSignerMock
        );

        const returnedPromiEvent = signAndSendMethodCommand.execute(
            moduleInstanceMock,
            methodModelMock,
            promiEvent,
            {}
        );

        expect(returnedPromiEvent).toEqual(promiEvent);

        promiEvent.on('transactionHash', () => {
            expect(methodModelMock.beforeExecution)
                .toHaveBeenCalledWith(moduleInstance);

            expect(transactionSignerMock.sign)
                .toHaveBeenCalledWith(methodModelMock.parameters[0], {});

            expect(providerAdapterMock.send)
                .toHaveBeenCalledWith('eth_sendRawTransaction', ['']);

            expect(transactionConfirmationWorkflowMock.execute)
                .toHaveBeenCalledWith(methodModelMock, moduleInstanceMock, 'response', promiEvent);

            expect(methodModelMock.rpcMethod).toBe('eth_sendRawTransaction');
            expect(methodModelMock.parameters[0]).toBe('');
        });
    });

    // it('calls execute and throws error', () => {
    //     methodModel.parameters = [{gasPrice: 100}];
    //
    //     methodModelMock
    //         .expects('beforeExecution')
    //         .withArgs(moduleInstance)
    //         .once();
    //
    //     transactionSignerMock
    //         .expects('sign')
    //         .withArgs(methodModel.parameters[0], {})
    //         .returns(
    //             new Promise((resolve, reject) => {
    //                 reject(new Error('error'));
    //             })
    //         )
    //         .once();
    //
    //     const returnedPromiEvent = signAndSendMethodCommand.execute(moduleInstance, methodModel, promiEvent, {});
    //
    //     expect(returnedPromiEvent).toEqual(promiEvent);
    //
    //     promiEvent.catch((error) => {
    //         expect(promiEventRemoveListenersSpy.calledOnce).toBeTruthy();
    //         expect(promiEventEmitSpy.calledOnce).toBeTruthy();
    //         expect(promiEventEmitSpy.calledWith('error', 'error')).toBeTruthy();
    //
    //         expect(methodModelCallbackSpy.calledOnce).toBeTruthy();
    //         expect(methodModelCallbackSpy.calledWith('error', null)).toBeTruthy();
    //         expect(error).toBeInstanceOf(Error);
    //
    //         expect(methodModel.rpcMethod).toBe('eth_sendRawTransaction');
    //
    //         transactionConfirmationWorkflowMock.verify();
    //         providerAdapterMock.verify();
    //         methodModelMock.verify();
    //     });
    // });
});
