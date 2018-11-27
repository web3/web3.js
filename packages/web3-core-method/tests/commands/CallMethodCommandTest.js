import CallMethodCommand from '../../src/commands/CallMethodCommand';
import AbstractMethodModel from '../../lib/models/AbstractMethodModel';
import {SocketProviderAdapter} from 'web3-providers';
import {AbstractWeb3Module} from 'web3-core';

// Mocks
jest.mock('SocketProviderAdapter');
jest.mock('../../lib/models/AbstractMethodModel');
jest.mock('AbstractWeb3Module');

/**
 * CallMethodCommand test
 */
describe('CallMethodCommandTest', () => {
    let callMethodCommand,
        providerAdapter,
        providerAdapterMock,
        moduleInstance,
        moduleInstanceMock,
        methodModel,
        methodModelMock;

    beforeEach(() => {
        providerAdapter = new SocketProviderAdapter({});
        providerAdapterMock = SocketProviderAdapter.mock.instances[0];

        moduleInstance = new AbstractWeb3Module(providerAdapterMock, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];

        methodModel = new AbstractMethodModel('', 0, {}, {});
        methodModelMock = AbstractMethodModel.mock.instances[0];
        methodModelMock.rpcMethod = 'RPC_METHOD';
        methodModelMock.parameters = ['FIRST_PARAM'];

        callMethodCommand = new CallMethodCommand();
    });

    it('calls execute', async (done) => {
        providerAdapterMock.send
            .mockReturnValueOnce(Promise.resolve('response'));

        methodModelMock.afterExecution
            .mockReturnValueOnce('response');

        moduleInstanceMock.currentProvider = providerAdapterMock;

        methodModelMock.callback = (error, response) => {
            expect(error).toBe(false);
            expect(response).toBe('response');

            done();
        };

        await expect(callMethodCommand.execute(moduleInstanceMock, methodModelMock)).resolves.toBe('response');

        expect(methodModelMock.beforeExecution)
            .toHaveBeenCalledWith(moduleInstanceMock);

        expect(providerAdapterMock.send)
            .toHaveBeenCalledWith(methodModelMock.rpcMethod, methodModelMock.parameters);

        expect(methodModelMock.afterExecution)
            .toHaveBeenCalledWith('response');
    });

    it('calls execute and throws error', async (done) => {
        providerAdapterMock.send
            .mockReturnValueOnce(Promise.reject(new Error('ERROR')));

        moduleInstanceMock.currentProvider = providerAdapterMock;

        methodModelMock.callback = (error, response) => {
            expect(error).toEqual(new Error('ERROR'));
            expect(response).toBe(null);

            done();
        };

        await expect(callMethodCommand.execute(moduleInstanceMock, methodModelMock))
            .rejects.toEqual(new Error('ERROR'));

        expect(methodModelMock.beforeExecution)
            .toHaveBeenCalledWith(moduleInstanceMock);

        expect(providerAdapterMock.send)
            .toHaveBeenCalledWith(methodModelMock.rpcMethod, methodModelMock.parameters);
    });
});
