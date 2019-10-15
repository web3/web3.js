import ConfluxWebCfxProvider from '../../../src/providers/ConfluxWebCfxProvider';
import JsonRpcResponseValidator from '../../../src/validators/JsonRpcResponseValidator';
import AbstractMethod from '../../__mocks__/AbstractMethod';
import AbstractConfluxModule from '../../__mocks__/AbstractConfluxModule';
import AbstractSocketProvider from '../../../lib/providers/AbstractSocketProvider';

/**
 * ConfluxWebCfxProvider test
 */
describe('ConfluxWebCfxProviderTest', () => {
    let confluxProvider, socketMock;

    beforeEach(() => {
        socketMock = {
            on: jest.fn()
        };

        confluxProvider = new ConfluxWebCfxProvider(socketMock);
    });

    it('constructor check', () => {
        expect(confluxProvider.timeout).toEqual(null);

        expect(confluxProvider.connection).toEqual(socketMock);

        expect(confluxProvider).toBeInstanceOf(AbstractSocketProvider);

        expect(confluxProvider.host).toEqual('ConfluxWebCfxProvider');
    });

    it('calls registerEventListeners and the expected listeners will be registered', () => {
        confluxProvider.registerEventListeners();

        expect(socketMock.on.mock.calls[0][0]).toEqual('notification');
        expect(socketMock.on.mock.calls[0][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[1][0]).toEqual('connect');
        expect(socketMock.on.mock.calls[1][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[2][0]).toEqual('connect');
        expect(socketMock.on.mock.calls[2][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[3][0]).toEqual('close');
        expect(socketMock.on.mock.calls[3][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[4][0]).toEqual('networkChanged');
        expect(socketMock.on.mock.calls[4][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[5][0]).toEqual('accountsChanged');
        expect(socketMock.on.mock.calls[5][1]).toBeInstanceOf(Function);
    });

    it('calls removeAllListeners with the "socket_networkChanged" event', (done) => {
        socketMock.removeListener = jest.fn((event, listener) => {
            expect(event).toEqual('networkChanged');

            expect(listener).toEqual(confluxProvider.onNetworkChanged);

            done();
        });

        confluxProvider.removeAllListeners('socket_networkChanged');
    });

    it('calls removeAllListeners with the "socket_accountsChanged" event', (done) => {
        socketMock.removeListener = jest.fn((event, listener) => {
            expect(event).toEqual('accountsChanged');

            expect(listener).toEqual(confluxProvider.onAccountsChanged);

            done();
        });

        confluxProvider.removeAllListeners('socket_accountsChanged');
    });

    it('calls removeAllListeners with the "socket_message" event', (done) => {
        socketMock.removeListener = jest.fn((event, listener) => {
            expect(event).toEqual('notification');

            expect(listener).toEqual(confluxProvider.onMessage);

            done();
        });

        confluxProvider.removeAllListeners('socket_message');
    });

    it('calls removeAllListeners with the "socket_ready" event', (done) => {
        socketMock.removeListener = jest.fn((event, listener) => {
            expect(event).toEqual('connect');

            expect(listener).toEqual(confluxProvider.onReady);

            done();
        });

        confluxProvider.removeAllListeners('socket_ready');
    });

    it('calls removeAllListeners with the "socket_close" event', (done) => {
        socketMock.removeListener = jest.fn((event, listener) => {
            expect(event).toEqual('close');

            expect(listener).toEqual(confluxProvider.onClose);

            done();
        });

        confluxProvider.removeAllListeners('socket_close');
    });

    it('calls removeAllListeners with the "socket_error" event', (done) => {
        socketMock.removeListener = jest.fn((event, listener) => {
            expect(event).toEqual('close');

            expect(listener).toEqual(confluxProvider.onError);

            done();
        });

        confluxProvider.removeAllListeners('socket_error');
    });

    it('calls removeAllListeners with the "socket_connect" event', (done) => {
        socketMock.removeListener = jest.fn((event, listener) => {
            expect(event).toEqual('connect');

            expect(listener).toEqual(confluxProvider.onConnect);

            done();
        });

        confluxProvider.removeAllListeners('socket_connect');
    });

    it('calls removeAllSocketListeners', () => {
        socketMock.removeAllListeners = jest.fn();

        confluxProvider.removeAllSocketListeners();

        expect(socketMock.removeAllListeners).toHaveBeenCalled();
    });

    it('calls onNetworkChanged and emits the "networkChanged" event', (done) => {
        confluxProvider.on('networkChanged', (networkId) => {
            expect(networkId).toEqual('ID');

            done();
        });

        confluxProvider.onNetworkChanged('ID');
    });

    it('calls onAccountsChanged and emits the "accountsChanged" event', (done) => {
        confluxProvider.on('accountsChanged', (accounts) => {
            expect(accounts).toEqual([]);

            done();
        });

        confluxProvider.onAccountsChanged([]);
    });

    it('calls onMessage and emits the correct event', (done) => {
        confluxProvider.subscriptions['0x0'] = true;

        confluxProvider.on('0x0', (accounts) => {
            expect(accounts).toEqual({subscription: '0x0'});

            done();
        });

        confluxProvider.onMessage({subscription: '0x0'});
    });

    it('calls send and returns a resolved promise with the response', async () => {
        JsonRpcResponseValidator.validate = jest.fn(() => {
            return true;
        });

        socketMock.send = jest.fn((method, parameters) => {
            expect(method).toEqual('method');

            expect(parameters).toEqual([]);

            return Promise.resolve(true);
        });

        const response = await confluxProvider.send('method', []);

        expect(response).toEqual(true);

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalled();
    });

    it('calls send and returns a rejected promise because of a invalid response', async () => {
        JsonRpcResponseValidator.validate = jest.fn(() => {
            return new Error('invalid');
        });

        socketMock.send = jest.fn((method, parameters) => {
            expect(method).toEqual('method');

            expect(parameters).toEqual([]);

            return Promise.resolve(false);
        });

        await expect(confluxProvider.send('method', [])).rejects.toThrow('invalid');

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalled();
    });

    it('calls sendBatch and returns a resolved promise with the response', async () => {
        const abstractMethodMock = new AbstractMethod();

        const moduleInstanceMock = new AbstractConfluxModule();

        abstractMethodMock.rpcMethod = 'RPC_METHOD';
        abstractMethodMock.parameters = [];

        abstractMethodMock.beforeExecution = jest.fn((moduleInstance) => {
            expect(moduleInstance).toEqual(moduleInstanceMock);
        });

        socketMock.send = jest.fn((method, parameters) => {
            expect(method).toEqual('RPC_METHOD');

            expect(parameters).toEqual([]);

            return Promise.resolve(true);
        });

        const response = await confluxProvider.sendBatch([abstractMethodMock], moduleInstanceMock);

        expect(response).toEqual([true]);

        expect(abstractMethodMock.beforeExecution).toHaveBeenCalled();
    });
});
