import CallMethodCommand from '../../src/commands/CallMethodCommand';
import AbstractMethodModel from '../../lib/models/AbstractMethodModel';
import {WebsocketProvider, SocketProviderAdapter} from 'web3-providers';
import {AbstractWeb3Module} from 'web3-core';

// Mocks
jest.mock('SocketProviderAdapter');
jest.mock('WebsocketProvider');
jest.mock('../../lib/models/AbstractMethodModel');
jest.mock('AbstractWeb3Module');

/**
 * CallMethodCommand test
 */
describe('CallMethodCommandTest', () => {
    let callMethodCommand,
        provider,
        providerAdapter,
        moduleInstance,
        methodModel,
        methodModelCallbackSpy;

    beforeEach(() => {
        provider = new WebsocketProvider('ws://127.0.0.1', {});
        providerAdapter = new SocketProviderAdapter(provider);
        moduleInstance = new AbstractWeb3Module(providerAdapter, {}, {}, {});
        methodModel = new AbstractMethodModel('', 0, {}, {});
        callMethodCommand = new CallMethodCommand();

        methodModelCallbackSpy = jest.fn();
        methodModel.callback = methodModelCallbackSpy;
    });

    it('calls execute', async () => {
        expect(AbstractMethodModel.beforeExecution)
            .toHaveBeenNthCalledWith(1, moduleInstance);

        expect(SocketProviderAdapter.send)
            .toHaveNthReturnedWith(1, new Promise(resolve => {
                resolve('response');
            }));

        expect(methodModelCallbackSpy)
            .toHaveBeenNthCalledWith(
                1,
                false,
                '0x0'
            );

        const returnValue = await callMethodCommand.execute(moduleInstance, methodModel);
        expect(returnValue).toBe('0x0');
    });

    it('calls execute and throws error', async () => {
        expect(AbstractMethodModel.beforeExecution)
            .toHaveBeenNthCalledWith(1, moduleInstance);

        expect(SocketProviderAdapter.send)
            .toHaveNthReturnedWith(1, new Promise((resolve, reject) => {
                reject(new Error('error'));
            }));

        try {
            await callMethodCommand.execute(moduleInstance, methodModel);
        } catch (error) {
            expect(error).toBe('error');
        }

        expect(methodModelCallbackSpy)
            .toHaveBeenNthCalledWith(
                1,
                new Error('error'),
                null
            );
    });
});
