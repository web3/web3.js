import {SocketProviderAdapter} from 'web3-providers';
import {AbstractWeb3Module} from 'web3-core';
import {PromiEvent} from 'web3-core-promievent';
import SendTransactionMethodCommand from '../../../src/commands/SendTransactionMethodCommand';
import TransactionConfirmationWorkflow from '../../../src/workflows/TransactionConfirmationWorkflow';
import AbstractMethod from '../../../lib/methods/AbstractMethod';
import TransactionSigner from '../../../src/signers/TransactionSigner';
import Accounts from '../../__mocks__/Accounts';

// Mocks
jest.mock('../../../src/workflows/TransactionConfirmationWorkflow');
jest.mock('../../../lib/methods/AbstractMethod');
jest.mock('../../../src/signers/TransactionSigner');
jest.mock('SocketProviderAdapter');
jest.mock('AbstractWeb3Module');

/**
 * SendTransactionMethodCommand test
 */
describe('SendTransactionMethodCommandTest', () => {
    let sendTransactionMethodCommand,
        providerAdapter,
        providerAdapterMock,
        moduleInstance,
        moduleInstanceMock,
        method,
        methodMock,
        promiEvent,
        transactionConfirmationWorkflow,
        transactionConfirmationWorkflowMock,
        transactionSigner,
        transactionSignerMock,
        accountsMock;

    beforeEach(() => {
        providerAdapter = new SocketProviderAdapter({});
        providerAdapterMock = SocketProviderAdapter.mock.instances[0];

        moduleInstance = new AbstractWeb3Module(providerAdapterMock, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];

        method = new AbstractMethod('', 0, {}, {}, {});
        methodMock = AbstractMethod.mock.instances[0];

        transactionSigner = new TransactionSigner();
        transactionSignerMock = TransactionSigner.mock.instances[0];

        accountsMock = new Accounts();

        promiEvent = new PromiEvent();

        transactionConfirmationWorkflow = new TransactionConfirmationWorkflow({}, {}, {});
        transactionConfirmationWorkflowMock = TransactionConfirmationWorkflow.mock.instances[0];
    });

    it('constructor check', () => {
        sendTransactionMethodCommand = new SendTransactionMethodCommand(
            transactionConfirmationWorkflowMock,
            transactionSignerMock,
            accountsMock
        );

        expect(sendTransactionMethodCommand.transactionConfirmationWorkflow)
            .toEqual(transactionConfirmationWorkflowMock);

        expect(sendTransactionMethodCommand.transactionSigner)
            .toEqual(transactionSignerMock);

        expect(sendTransactionMethodCommand.accounts)
            .toEqual(accountsMock);
    });

    it(
        'calls execute with method of type "eth_sendTransaction" and signs the transaction as first',
        async (done) => {
            methodMock.rpcMethod = 'eth_sendTransaction';
            methodMock.callback = jest.fn();
            methodMock.parameters = [100];
            accountsMock.wallet[0] = {privateKey: '0x0'};

            transactionSignerMock.sign
                .mockReturnValueOnce(Promise.resolve('0x0'));

            providerAdapterMock.send
                .mockReturnValueOnce(Promise.resolve('0x0'));

            moduleInstanceMock.currentProvider = providerAdapterMock;

            sendTransactionMethodCommand = new SendTransactionMethodCommand(
                transactionConfirmationWorkflowMock,
                transactionSignerMock,
                accountsMock
            );

            promiEvent.on('transactionHash', (response) => {
                expect(response)
                    .toBe('0x0');

                expect(methodMock.beforeExecution)
                    .toHaveBeenCalledWith(moduleInstanceMock);

                expect(transactionConfirmationWorkflowMock.execute)
                    .toHaveBeenCalledWith(methodMock, moduleInstanceMock, '0x0', promiEvent);

                expect(providerAdapter.send)
                    .toHaveBeenCalledWith(methodMock.rpcMethod, methodMock.parameters);

                expect(methodMock.rpcMethod)
                    .toBe('eth_sendRawTransaction');

                expect(transactionSignerMock.sign)
                    .toHaveBeenCalledWith(100, accountsMock);

                done();
            });

            const response = await sendTransactionMethodCommand.execute(moduleInstanceMock, methodMock, promiEvent);

            expect(response)
                .toBe('0x0');

            expect(methodMock.callback)
                .toHaveBeenCalledWith(false, '0x0');
        }
    );

    it(
        'calls execute with method of type "eth_sendTransaction" and throws an error on sign',
        async (done) => {
            methodMock.rpcMethod = 'eth_sendTransaction';
            methodMock.callback = jest.fn();
            methodMock.parameters = [100];
            accountsMock.wallet[0] = {privateKey: '0x0'};

            const error = new Error('SIGN ERROR');
            transactionSignerMock.sign
                .mockReturnValueOnce(Promise.reject(error));

            sendTransactionMethodCommand = new SendTransactionMethodCommand(
                transactionConfirmationWorkflowMock,
                transactionSignerMock,
                accountsMock
            );

            promiEvent.on('error', () => {
                expect(methodMock.beforeExecution)
                    .toHaveBeenCalledWith(moduleInstanceMock);

                expect(methodMock.rpcMethod)
                    .toBe('eth_sendRawTransaction');

                done();
            });

            try {
                await sendTransactionMethodCommand.execute(moduleInstanceMock, methodMock, promiEvent);
            } catch (error2) {
                expect(error2)
                    .toEqual(error);

                expect(methodMock.callback)
                    .toHaveBeenCalledWith(error, null);
            }
        }
    );

    it(
        'calls execute with method of type "eth_sendTransaction". Signs the message and throws an error on send',
        async () => {
            methodMock.rpcMethod = 'eth_sendTransaction';
            methodMock.callback = jest.fn();
            methodMock.parameters = [100];
            accountsMock.wallet[0] = {privateKey: '0x0'};

            transactionSignerMock.sign
                .mockReturnValueOnce(Promise.resolve('0x0'));

            const error = new Error('SEND ERROR');
            providerAdapterMock.send
                .mockReturnValueOnce(Promise.reject(error));

            moduleInstanceMock.currentProvider = providerAdapterMock;

            sendTransactionMethodCommand = new SendTransactionMethodCommand(
                transactionConfirmationWorkflowMock,
                transactionSignerMock,
                accountsMock
            );

            promiEvent.on('error', () => {
                expect(methodMock.beforeExecution)
                    .toHaveBeenCalledWith(moduleInstanceMock);

                expect(providerAdapter.send)
                    .toHaveBeenCalled();

                expect(methodMock.rpcMethod)
                    .toBe('eth_sendRawTransaction');
            });

            try {
                await sendTransactionMethodCommand.execute(moduleInstanceMock, methodMock, promiEvent);
            } catch (error2) {
                expect(error2)
                    .toEqual(error);

                expect(methodMock.callback)
                    .toHaveBeenCalledWith(error, null);
            }
        }
    );

    it(
        'calls execute with method of type "eth_sendTransaction" and has the gas properties set',
        async (done) => {
            methodMock.rpcMethod = 'eth_sendTransaction';
            methodMock.callback = jest.fn();
            methodMock.parameters = [{
                gas: 100,
                gasPrice: 100
            }];

            transactionSignerMock.sign
                .mockReturnValueOnce(Promise.resolve('0x0'));

            providerAdapterMock.send
                .mockReturnValueOnce(Promise.resolve('0x0'));

            moduleInstanceMock.currentProvider = providerAdapterMock;

            sendTransactionMethodCommand = new SendTransactionMethodCommand(
                transactionConfirmationWorkflowMock,
                transactionSignerMock,
                accountsMock
            );

            promiEvent.on('transactionHash', (response) => {
                expect(response)
                    .toBe('0x0');

                expect(methodMock.beforeExecution)
                    .toHaveBeenCalledWith(moduleInstanceMock);

                expect(transactionConfirmationWorkflowMock.execute)
                    .toHaveBeenCalledWith(methodMock, moduleInstanceMock, '0x0', promiEvent);

                expect(providerAdapter.send)
                    .toHaveBeenCalledWith(methodMock.rpcMethod, methodMock.parameters);

                done();
            });

            const response = await sendTransactionMethodCommand.execute(moduleInstanceMock, methodMock, promiEvent);

            expect(response)
                .toBe('0x0');

            expect(methodMock.callback)
                .toHaveBeenCalledWith(false, '0x0');
        }
    );

    it(
        'calls execute with method of type "eth_sendTransaction" and without gasLimit property set',
        async (done) => {
            methodMock.rpcMethod = 'eth_sendTransaction';
            methodMock.callback = jest.fn();
            methodMock.parameters = [{
                gasPrice: 100
            }];

            transactionSignerMock.sign
                .mockReturnValueOnce(Promise.resolve('0x0'));

            providerAdapterMock.send
                .mockReturnValueOnce(Promise.resolve('0x0'));

            moduleInstanceMock.currentProvider = providerAdapterMock;
            moduleInstanceMock.defaultGas = 100;

            sendTransactionMethodCommand = new SendTransactionMethodCommand(
                transactionConfirmationWorkflowMock,
                transactionSignerMock,
                accountsMock
            );

            promiEvent.on('transactionHash', (response) => {
                expect(response)
                    .toBe('0x0');

                expect(methodMock.beforeExecution)
                    .toHaveBeenCalledWith(moduleInstanceMock);

                expect(transactionConfirmationWorkflowMock.execute)
                    .toHaveBeenCalledWith(methodMock, moduleInstanceMock, '0x0', promiEvent);

                expect(providerAdapter.send)
                    .toHaveBeenCalledWith(methodMock.rpcMethod, methodMock.parameters);

                expect(methodMock.parameters[0].gas)
                    .toBe(100);

                done();
            });

            const response = await sendTransactionMethodCommand.execute(moduleInstanceMock, methodMock, promiEvent);

            expect(response)
                .toBe('0x0');

            expect(methodMock.callback)
                .toHaveBeenCalledWith(false, '0x0');
        }
    );

    it(
        'calls execute with method of type "eth_sendTransaction". Without gas properties ' +
        'set on the method. But with the default properties from the module',
        async (done) => {
            methodMock.rpcMethod = 'eth_sendTransaction';
            methodMock.callback = jest.fn();
            methodMock.parameters = [{}];

            transactionSignerMock.sign
                .mockReturnValueOnce(Promise.resolve('0x0'));

            providerAdapterMock.send
                .mockReturnValueOnce(Promise.resolve('0x0'));

            moduleInstanceMock.currentProvider = providerAdapterMock;
            moduleInstanceMock.defaultGas = 100;
            moduleInstanceMock.defaultGasPrice = 100;

            sendTransactionMethodCommand = new SendTransactionMethodCommand(
                transactionConfirmationWorkflowMock,
                transactionSignerMock,
                accountsMock
            );

            promiEvent.on('transactionHash', (response) => {
                expect(response)
                    .toBe('0x0');

                expect(methodMock.beforeExecution)
                    .toHaveBeenCalledWith(moduleInstanceMock);

                expect(transactionConfirmationWorkflowMock.execute)
                    .toHaveBeenCalledWith(methodMock, moduleInstanceMock, '0x0', promiEvent);

                expect(providerAdapter.send)
                    .toHaveBeenCalledWith(methodMock.rpcMethod, methodMock.parameters);

                expect(methodMock.parameters[0].gas)
                    .toBe(100);

                expect(methodMock.parameters[0].gasPrice)
                    .toBe(100);

                done();
            });

            const response = await sendTransactionMethodCommand.execute(moduleInstanceMock, methodMock, promiEvent);

            expect(response)
                .toBe('0x0');

            expect(methodMock.callback)
                .toHaveBeenCalledWith(false, '0x0');
        }
    );

    it(
        'calls execute with method of type "eth_sendTransaction". Without gas properties ' +
        'set on the method and also without default properties from the module',
        async (done) => {
            methodMock.rpcMethod = 'eth_sendTransaction';
            methodMock.callback = jest.fn();
            methodMock.parameters = [{}];

            transactionSignerMock.sign
                .mockReturnValueOnce(Promise.resolve('0x0'));

            providerAdapterMock.send
                .mockReturnValueOnce(Promise.resolve(100));

            providerAdapterMock.send
                .mockReturnValueOnce(Promise.resolve('0x0'));

            moduleInstanceMock.currentProvider = providerAdapterMock;

            sendTransactionMethodCommand = new SendTransactionMethodCommand(
                transactionConfirmationWorkflowMock,
                transactionSignerMock,
                accountsMock
            );

            promiEvent.on('transactionHash', (response) => {
                expect(response)
                    .toBe('0x0');

                expect(methodMock.beforeExecution)
                    .toHaveBeenCalledWith(moduleInstanceMock);

                expect(transactionConfirmationWorkflowMock.execute)
                    .toHaveBeenCalledWith(methodMock, moduleInstanceMock, '0x0', promiEvent);

                expect(providerAdapter.send)
                    .toHaveBeenCalledWith('eth_gasPrice', []);

                expect(providerAdapter.send)
                    .toHaveBeenCalledWith(methodMock.rpcMethod, methodMock.parameters);

                expect(methodMock.parameters[0].gasPrice)
                    .toBe(100);

                done();
            });

            const response = await sendTransactionMethodCommand.execute(moduleInstanceMock, methodMock, promiEvent);

            expect(response)
                .toBe('0x0');

            expect(methodMock.callback)
                .toHaveBeenCalledWith(false, '0x0');
        }
    );

    it(
        'calls execute with method of type "eth_sendRawTransaction". Without gas properties ' +
        'set on the method and also without default properties from the module',
        async (done) => {
            methodMock.rpcMethod = 'eth_sendRawTransaction';
            methodMock.callback = jest.fn();
            methodMock.parameters = [{
                gas: 100,
                gasPrice: 100
            }];

            transactionSignerMock.sign
                .mockReturnValueOnce(Promise.resolve('0x0'));

            providerAdapterMock.send
                .mockReturnValueOnce(Promise.resolve('0x0'));

            moduleInstanceMock.currentProvider = providerAdapterMock;

            sendTransactionMethodCommand = new SendTransactionMethodCommand(
                transactionConfirmationWorkflowMock,
                transactionSignerMock,
                accountsMock
            );

            promiEvent.on('transactionHash', (response) => {
                expect(response)
                    .toBe('0x0');

                expect(methodMock.beforeExecution)
                    .toHaveBeenCalledWith(moduleInstanceMock);

                expect(transactionConfirmationWorkflowMock.execute)
                    .toHaveBeenCalledWith(methodMock, moduleInstanceMock, '0x0', promiEvent);

                expect(providerAdapter.send)
                    .toHaveBeenCalledWith(methodMock.rpcMethod, methodMock.parameters);

                done();
            });

            const response = await sendTransactionMethodCommand.execute(moduleInstanceMock, methodMock, promiEvent);

            expect(response)
                .toBe('0x0');

            expect(methodMock.callback)
                .toHaveBeenCalledWith(false, '0x0');
        }
    );
});
