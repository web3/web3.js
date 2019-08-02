import Web3EthereumProvider from '../../../src/providers/Web3EthereumProvider';
import AbstractMethod from '../../__mocks__/AbstractMethod';
import AbstractWeb3Module from '../../__mocks__/AbstractWeb3Module';
import AbstractSocketProvider from '../../../lib/providers/AbstractSocketProvider';

/**
 * Web3EthereumProvider test
 */
describe('Web3EthereumProviderTest', () => {
    let ethereumProvider, socketMock;

    beforeEach(() => {
        socketMock = {
            on: jest.fn()
        };

        ethereumProvider = new Web3EthereumProvider(socketMock);
    });

    it('constructor check', () => {
        expect(ethereumProvider.timeout).toEqual(null);

        expect(ethereumProvider.connection).toEqual(socketMock);

        expect(ethereumProvider).toBeInstanceOf(AbstractSocketProvider);

        expect(ethereumProvider.host).toEqual('Web3EthereumProvider');
    });

    it('calls registerEventListeners and the expected listeners will be registered', () => {
        ethereumProvider.registerEventListeners();

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

            expect(listener).toEqual(ethereumProvider.onNetworkChanged);

            done();
        });

        ethereumProvider.removeAllListeners('socket_networkChanged');
    });

    it('calls removeAllListeners with the "socket_accountsChanged" event', (done) => {
        socketMock.removeListener = jest.fn((event, listener) => {
            expect(event).toEqual('accountsChanged');

            expect(listener).toEqual(ethereumProvider.onAccountsChanged);

            done();
        });

        ethereumProvider.removeAllListeners('socket_accountsChanged');
    });

    it('calls removeAllListeners with the "socket_message" event', (done) => {
        socketMock.removeListener = jest.fn((event, listener) => {
            expect(event).toEqual('notification');

            expect(listener).toEqual(ethereumProvider.onMessage);

            done();
        });

        ethereumProvider.removeAllListeners('socket_message');
    });

    it('calls removeAllListeners with the "socket_ready" event', (done) => {
        socketMock.removeListener = jest.fn((event, listener) => {
            expect(event).toEqual('connect');

            expect(listener).toEqual(ethereumProvider.onReady);

            done();
        });

        ethereumProvider.removeAllListeners('socket_ready');
    });

    it('calls removeAllListeners with the "socket_close" event', (done) => {
        socketMock.removeListener = jest.fn((event, listener) => {
            expect(event).toEqual('close');

            expect(listener).toEqual(ethereumProvider.onClose);

            done();
        });

        ethereumProvider.removeAllListeners('socket_close');
    });

    it('calls removeAllListeners with the "socket_error" event', (done) => {
        socketMock.removeListener = jest.fn((event, listener) => {
            expect(event).toEqual('close');

            expect(listener).toEqual(ethereumProvider.onError);

            done();
        });

        ethereumProvider.removeAllListeners('socket_error');
    });

    it('calls removeAllListeners with the "socket_connect" event', (done) => {
        socketMock.removeListener = jest.fn((event, listener) => {
            expect(event).toEqual('connect');

            expect(listener).toEqual(ethereumProvider.onConnect);

            done();
        });

        ethereumProvider.removeAllListeners('socket_connect');
    });

    it('calls removeAllSocketListeners', () => {
        socketMock.removeListener = jest.fn();

        ethereumProvider.removeAllSocketListeners();

        expect(socketMock.removeListener).toHaveBeenNthCalledWith(
            1, 'accountsChanged', ethereumProvider.onAccountsChanged
        );
        expect(socketMock.removeListener).toHaveBeenNthCalledWith(
            2, 'networkChanged', ethereumProvider.onNetworkChanged
        );
    });

    it('calls onNetworkChanged and emits the "networkChanged" event', (done) => {
        ethereumProvider.on('networkChanged', (networkId) => {
            expect(networkId).toEqual('ID');

            done();
        });

        ethereumProvider.onNetworkChanged('ID');
    });

    it('calls onAccountsChanged and emits the "accountsChanged" event', (done) => {
        ethereumProvider.on('accountsChanged', (accounts) => {
            expect(accounts).toEqual([]);

            done();
        });

        ethereumProvider.onAccountsChanged([]);
    });

    it('calls onMessage and emits the correct event', (done) => {
        ethereumProvider.subscriptions['0x0'] = true;

        ethereumProvider.on('0x0', (accounts) => {
            expect(accounts).toEqual({subscription: '0x0'});

            done();
        });

        ethereumProvider.onMessage({subscription: '0x0'});
    });

    it('calls send and returns a resolved promise with the response', async () => {
        socketMock.send = jest.fn((method, parameters) => {
            expect(method).toEqual('method');

            expect(parameters).toEqual([]);

            return Promise.resolve(true);
        });

        const response = await ethereumProvider.send('method', []);

        expect(response).toEqual(true);
    });

    it('calls send and returns a rejected promise because of an error response', async () => {
        socketMock.send = jest.fn((method, parameters) => {
            expect(method).toEqual('method');

            expect(parameters).toEqual([]);

            return Promise.reject(new Error('invalid'));
        });

        await expect(ethereumProvider.send('method', [])).rejects.toThrow('Node error: invalid');
    });

    it('calls sendBatch and returns a resolved promise with the response', async () => {
        const abstractMethodMock = new AbstractMethod();

        const moduleInstanceMock = new AbstractWeb3Module();

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

        const response = await ethereumProvider.sendBatch([abstractMethodMock], moduleInstanceMock);

        expect(response).toEqual([true]);

        expect(abstractMethodMock.beforeExecution).toHaveBeenCalled();
    });
});
