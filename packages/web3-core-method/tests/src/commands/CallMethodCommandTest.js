import CallMethodCommand from '../../../src/commands/CallMethodCommand';
import AbstractMethod from '../../../lib/methods/AbstractMethod';
import {SocketProviderAdapter} from 'web3-providers';
import {AbstractWeb3Module} from 'web3-core';
import Accounts from '../../__mocks__/Accounts';
import MessageSigner from '../../../src/signers/MessageSigner';

// Mocks
jest.mock('SocketProviderAdapter');
jest.mock('AbstractWeb3Module');
jest.mock('../../../lib/methods/AbstractMethod');
jest.mock('../../../src/signers/MessageSigner');

/**
 * CallMethodCommand test
 */
describe('CallMethodCommandTest', () => {
    let callMethodCommand,
        providerAdapter,
        providerAdapterMock,
        moduleInstance,
        moduleInstanceMock,
        method,
        methodMock,
        accountsMock,
        messageSigner,
        messageSignerMock;

    beforeEach(() => {
        providerAdapter = new SocketProviderAdapter({});
        providerAdapterMock = SocketProviderAdapter.mock.instances[0];

        moduleInstance = new AbstractWeb3Module(providerAdapterMock, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];

        method = new AbstractMethod('', 0, {}, {});
        methodMock = AbstractMethod.mock.instances[0];

        accountsMock = new Accounts();

        messageSigner = new MessageSigner();
        messageSignerMock = MessageSigner.mock.instances[0];

    });

    it('constructor check', () => {
        accountsMock = new Accounts();
        callMethodCommand = new CallMethodCommand(accountsMock, messageSignerMock);

        expect(callMethodCommand.accounts)
            .toEqual(accountsMock);

        expect(callMethodCommand.messageSigner)
            .toEqual(messageSignerMock);
    });

    it(
        'calls execute and method has rpcMethod property with ' +
        'value "eth_sign" and signs the message on the client',
        async () => {
            methodMock.rpcMethod = 'eth_sign';
            methodMock.callback = jest.fn();
            methodMock.parameters = ['0x00'];

            accountsMock.wallet[0] = {privateKey: '0x0'};

            messageSignerMock.sign
                .mockReturnValueOnce('0x00');

            methodMock.afterExecution
                .mockReturnValueOnce('0x0');

            callMethodCommand = new CallMethodCommand(accountsMock, messageSignerMock);
            const response = await callMethodCommand.execute(moduleInstanceMock, methodMock);

            expect(response)
                .toBe('0x0');

            expect(methodMock.beforeExecution)
                .toHaveBeenCalledWith(moduleInstanceMock);

            expect(methodMock.afterExecution)
                .toHaveBeenCalledWith('0x00');

            expect(methodMock.callback)
                .toHaveBeenCalledWith(false, '0x0');
        }
    );

    it(
        'method has rpcMethod property with value "eth_sign" and signs the' +
        ' message on the client but the signer throws an error',
        async () => {
            methodMock.rpcMethod = 'eth_sign';
            methodMock.callback = jest.fn();
            methodMock.parameters = ['0x00'];

            accountsMock.wallet[0] = {privateKey: '0x0'};

            const error = new Error('SIGN ERROR');
            messageSignerMock.sign = jest.fn(() => {
                throw error;
            });

            callMethodCommand = new CallMethodCommand(accountsMock, messageSignerMock);

            try {
                await callMethodCommand.execute(moduleInstanceMock, methodMock)
            } catch(error) {
                expect(error)
                    .toBeInstanceOf(Error);

                expect(methodMock.beforeExecution)
                    .toHaveBeenCalledWith(moduleInstanceMock);

                expect(methodMock.callback)
                    .toHaveBeenCalledWith(error, null);
            }
        }
    );

    it('method is not of type "eth_sign" and will just send the request to the connected node', async () => {
        methodMock.callback = jest.fn();

        providerAdapterMock.send
            .mockReturnValueOnce(Promise.resolve('0x0'));

        methodMock.afterExecution
            .mockReturnValueOnce('0x0');

        moduleInstanceMock.currentProvider = providerAdapterMock;

        callMethodCommand = new CallMethodCommand(accountsMock, messageSignerMock);
        const response = await callMethodCommand.execute(moduleInstanceMock, methodMock);

        expect(response)
            .toBe('0x0');

        expect(methodMock.afterExecution)
            .toHaveBeenCalledWith('0x0');

        expect(methodMock.beforeExecution)
            .toHaveBeenCalledWith(moduleInstanceMock);

        expect(providerAdapterMock.send)
            .toHaveBeenCalledWith(methodMock.rpcMethod, methodMock.parameters);

        expect(methodMock.afterExecution)
            .toHaveBeenCalledWith('0x0');

        expect(methodMock.callback)
            .toHaveBeenCalledWith(false, '0x0');
    });

    it(
        'method is not of type "eth_sign" and will throw an Error on' +
        ' sending the request to the connected node',
        async () => {
            methodMock.callback = jest.fn();

            const error = new Error('ERROR ON SEND');
            providerAdapterMock.send = jest.fn(() => {
                throw error;
            });

            moduleInstanceMock.currentProvider = providerAdapterMock;

            callMethodCommand = new CallMethodCommand(accountsMock, messageSignerMock);

            try {
                await callMethodCommand.execute(moduleInstanceMock, methodMock);
            } catch (error2) {
                expect(error2)
                    .toEqual(error);

                expect(methodMock.beforeExecution)
                    .toHaveBeenCalledWith(moduleInstanceMock);

                expect(providerAdapterMock.send)
                    .toHaveBeenCalledWith(methodMock.rpcMethod, methodMock.parameters);

                expect(methodMock.callback)
                    .toHaveBeenCalledWith(error, null);
            }
        }
    );

    it(
        'method is not of type "eth_sign" and will throw an Error on ' +
        'sending the request to the connected node without a callback defined',
        async () => {
            const error = new Error('ERROR ON SEND');
            providerAdapterMock.send = jest.fn(() => {
                throw error;
            });

            moduleInstanceMock.currentProvider = providerAdapterMock;

            callMethodCommand = new CallMethodCommand(accountsMock, messageSignerMock);

            try {
                await callMethodCommand.execute(moduleInstanceMock, methodMock);
            } catch (error2) {
                expect(error2)
                    .toEqual(error);

                expect(methodMock.beforeExecution)
                    .toHaveBeenCalledWith(moduleInstanceMock);

                expect(providerAdapterMock.send)
                    .toHaveBeenCalledWith(methodMock.rpcMethod, methodMock.parameters);
            }
        }
    );
});
