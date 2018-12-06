import SendMethodCommand from '../../../src/commands/SendTransactionMethodCommand';
import TransactionConfirmationWorkflow from '../../../src/workflows/TransactionConfirmationWorkflow';
import AbstractMethodModel from '../../lib/models/AbstractMethodModel';
import {SocketProviderAdapter} from 'packages/web3-providers/dist/web3-providers.cjs';
import {AbstractWeb3Module} from 'packages/web3-core/dist/web3-core.cjs';
import {PromiEvent} from 'packages/web3-core-promievent/dist/web3-core-promievent.cjs';

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
        expect(sendMethodCommand.transactionConfirmationWorkflow)
            .toEqual(transactionConfirmationWorkflowMock);
    });

    it('calls execute with gasPrice & gas defined', (done) => {
        methodModelMock.rpcMethod = 'eth_sendTransaction';
        methodModelMock.parameters = [
            {
                gasPrice: 100,
                gas: 100
            }
        ];

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

            expect(methodModelMock.parameters[0].gasPrice)
                .toBe(100);

            expect(methodModelMock.parameters[0].gas)
                .toBe(100);
        });
    });

    it('calls execute without gasPrice & gas defined but with defaultGasPrice & gasLimit', () => {
        methodModelMock.parameters = [{}];
        methodModelMock.rpcMethod = 'eth_sendTransaction';

        providerAdapterMock.send
            .mockReturnValue(Promise.resolve('response'));

        moduleInstanceMock.currentProvider = providerAdapterMock;
        moduleInstanceMock.defaultGasPrice = 100;
        moduleInstanceMock.defaultGas = 100;

        const returnedPromiEvent = sendMethodCommand.execute(moduleInstanceMock, methodModelMock, promiEvent);

        expect(returnedPromiEvent).toEqual(promiEvent);

        promiEvent.on('transactionHash', (response) => {
            expect(methodModelMock.beforeExecution)
                .toHaveBeenCalledWith(moduleInstanceMock);

            expect(providerAdapterMock.send)
                .toHaveBeenCalledWith(methodModelMock.rpcMethod, methodModelMock.parameters);

            expect(transactionConfirmationWorkflowMock.execute)
                .toHaveBeenCalledWith(methodModelMock, moduleInstanceMock, response, promiEvent);

            expect(response)
                .toBe('response');

            expect(methodModelMock.parameters[0].gasPrice)
                .toBe(100);

            expect(methodModelMock.parameters[0].gas)
                .toBe(100);
        });
    });

    it('calls execute without gasPrice, gas, defaultGasPrice and defaultGasLimit defined', () => {
        methodModelMock.parameters = [{}];
        methodModelMock.rpcMethod = 'eth_sendTransaction';

        providerAdapterMock.send
            .mockReturnValueOnce(Promise.resolve(100));

        providerAdapterMock.send
            .mockReturnValueOnce(Promise.resolve('response'));

        moduleInstanceMock.currentProvider = providerAdapterMock;

        const returnedPromiEvent = sendMethodCommand.execute(moduleInstanceMock, methodModelMock, promiEvent);

        expect(returnedPromiEvent)
            .toEqual(promiEvent);

        promiEvent.on('transactionHash', (response) => {
            expect(methodModelMock.beforeExecution)
                .toHaveBeenCalledWith(moduleInstanceMock);

            expect(providerAdapterMock.send)
                .toHaveBeenCalledWith('eth_gasPrice', []);

            expect(providerAdapterMock.send)
                .toHaveBeenCalledWith(methodModelMock.rpcMethod, methodModelMock.parameters);

            expect(transactionConfirmationWorkflowMock.execute)
                .toHaveBeenCalledWith(methodModelMock, moduleInstanceMock, response, promiEvent);

            expect(response)
                .toBe('response');

            expect(methodModelMock.parameters[0].gasPrice)
                .toBe(100);
        });
    });

    it('calls execute and throws error', () => {
        methodModelMock.parameters = [{gasPrice: 100}];
        methodModelMock.rpcMethod = 'eth_sendTransaction';

        providerAdapterMock.send
            .mockReturnValueOnce(Promise.reject(new Error('error')));

        moduleInstanceMock.currentProvider = providerAdapterMock;

        const returnedPromiEvent = sendMethodCommand.execute(moduleInstanceMock, methodModelMock, promiEvent);

        expect(returnedPromiEvent).toEqual(promiEvent);

        returnedPromiEvent.on('error', (error) => {
            expect(providerAdapterMock.send)
                .toHaveBeenCalledWith(methodModelMock.rpcMethod, methodModelMock.parameters);

            expect(methodModelMock.beforeExecution)
                .toHaveBeenCalledWith(moduleInstanceMock);

            expect(error).toBeInstanceOf(Error);
        });

        return expect(promiEvent).rejects.toThrow('error');
    });
});
