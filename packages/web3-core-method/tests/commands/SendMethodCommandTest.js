import SendMethodCommand from '../../src/commands/SendMethodCommand';
import TransactionConfirmationWorkflow from '../../src/workflows/TransactionConfirmationWorkflow';
import AbstractMethodModel from '../../lib/models/AbstractMethodModel';
import {SocketProviderAdapter} from 'web3-providers';
import {AbstractWeb3Module} from 'web3-core';
import {PromiEvent} from 'web3-core-promievent';

// Mocks
jest.mock('../../src/workflows/TransactionConfirmationWorkflow');
jest.mock('SocketProviderAdapter');
jest.mock('../../lib/models/AbstractMethodModel');
jest.mock('AbstractWeb3Module');

/**
 * SendMethodCommand test
 */
describe('SendMethodCommandTest', () => {
    let sendMethodCommand,
        providerAdapter,
        providerAdapterMock,
        moduleInstance,
        moduleInstanceMock,
        methodModel,
        methodModelMock,
        promiEvent,
        transactionConfirmationWorkflow,
        transactionConfirmationWorkflowMock;

    beforeEach(() => {
        providerAdapter = new SocketProviderAdapter({});
        providerAdapterMock = SocketProviderAdapter.mock.instances[0];

        moduleInstance = new AbstractWeb3Module(providerAdapterMock, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];

        methodModel = new AbstractMethodModel('', 0, {}, {});
        methodModelMock = AbstractMethodModel.mock.instances[0];

        promiEvent = new PromiEvent();

        transactionConfirmationWorkflow = new TransactionConfirmationWorkflow({}, {}, {});
        transactionConfirmationWorkflowMock = TransactionConfirmationWorkflow.mock.instances[0];

        sendMethodCommand = new SendMethodCommand(transactionConfirmationWorkflowMock);
    });

    it('constructor has been called and the properties are aet', () => {
        expect(sendMethodCommand.transactionConfirmationWorkflow).toEqual(transactionConfirmationWorkflowMock);
    });

    it('calls execute with gasPrice defined', (done) => {
        methodModelMock.parameters = [{gasPrice: 100}];
        methodModelMock.rpcMethod = 'eth_sendTransaction';

        providerAdapterMock.send
            .mockReturnValueOnce(Promise.resolve('response'));

        moduleInstanceMock.currentProvider = providerAdapterMock;

        methodModelMock.callback = (error, response) => {
            expect(error).toBe(false);
            expect(response).toBe('response');

            done();
        };

        const returnedPromiEvent = sendMethodCommand.execute(moduleInstanceMock, methodModelMock, promiEvent);
        expect(returnedPromiEvent).toEqual(promiEvent);

        promiEvent.on('transactionHash', (response) => {
            expect(response).toBe('response');

            expect(methodModelMock.beforeExecution)
                .toHaveBeenCalledWith(moduleInstanceMock);

            expect(providerAdapterMock.send)
                .toHaveBeenCalledWith(methodModelMock.rpcMethod, methodModelMock.parameters);

            expect(transactionConfirmationWorkflowMock.execute)
                .toHaveBeenCalledWith(methodModelMock, moduleInstanceMock, 'response', promiEvent);
        })
    });

    // it('calls execute without gasPrice defined', () => {
    //     methodModel.parameters = [{}];
    //     methodModel.rpcMethod = 'eth_sendTransaction';
    //
    //     methodModelMock
    //         .expects('beforeExecution')
    //         .withArgs(moduleInstance)
    //         .once();
    //
    //     providerAdapterMock
    //         .expects('send')
    //         .withArgs('eth_gasPrice', [])
    //         .returns(
    //             new Promise((resolve) => {
    //                 resolve(100);
    //             })
    //         )
    //         .once();
    //
    //     providerAdapterMock
    //         .expects('send')
    //         .withArgs(methodModel.rpcMethod, methodModel.parameters)
    //         .returns(
    //             new Promise((resolve) => {
    //                 resolve('response');
    //             })
    //         )
    //         .once();
    //
    //     transactionConfirmationWorkflowMock
    //         .expects('execute')
    //         .withArgs(methodModel, moduleInstance, 'response', promiEvent)
    //         .once();
    //
    //     const returnedPromiEvent = sendMethodCommand.execute(moduleInstance, methodModel, promiEvent);
    //
    //     expect(returnedPromiEvent).toEqual(promiEvent);
    //
    //     promiEvent.on('transactionHash', (response) => {
    //         expect(response).toBe('response');
    //         expect(methodModel.parameters[0].gasPrice).toBe(100);
    //
    //         transactionConfirmationWorkflowMock.verify();
    //         providerAdapterMock.verify();
    //         methodModelMock.verify();
    //     });
    // });
    //
    // it('calls execute and throws error', () => {
    //     methodModel.parameters = [{gasPrice: 100}];
    //     methodModel.rpcMethod = 'eth_sendTransaction';
    //
    //     methodModelMock
    //         .expects('beforeExecution')
    //         .withArgs(moduleInstance)
    //         .once();
    //
    //     providerAdapterMock
    //         .expects('send')
    //         .withArgs(methodModel.rpcMethod, methodModel.parameters)
    //         .returns(
    //             new Promise((resolve, reject) => {
    //                 reject(new Error('error'));
    //             })
    //         )
    //         .once();
    //
    //     promiEventMock
    //         .expects('reject')
    //         .withArgs('error')
    //         .once();
    //
    //     const returnedPromiEvent = sendMethodCommand.execute(moduleInstance, methodModel, promiEvent);
    //
    //     expect(returnedPromiEvent).toEqual(promiEvent);
    //
    //     promiEvent.on('error', (error) => {
    //         expect(error).toBeInstanceOf(Error);
    //
    //         providerAdapterMock.verify();
    //         methodModelMock.verify();
    //         promiEventMock.verify();
    //     });
    // });
});
