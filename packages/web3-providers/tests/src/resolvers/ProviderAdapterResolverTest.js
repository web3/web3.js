import ProviderAdapterResolver from '../../../src/resolvers/ProviderAdapterResolver';
import ProvidersModuleFactory from '../../../src/factories/ProvidersModuleFactory';
import HttpProviderAdapter from '../../../src/adapters/HttpProviderAdapter';
import SocketProviderAdapter from '../../../src/adapters/SocketProviderAdapter';
import HttpProvider from '../../../src/providers/HttpProvider';
import WebsocketProvider from '../../../src/providers/WebsocketProvider';
import IpcProvider from '../../../src/providers/IpcProvider';

// Mocks
jest.mock('../../../src/factories/ProvidersModuleFactory');
jest.mock('../../../src/providers/HttpProvider');
jest.mock('../../../src/providers/WebsocketProvider');
jest.mock('../../../src/providers/IpcProvider');
jest.mock('../../../src/adapters/HttpProviderAdapter');
jest.mock('../../../src/adapters/SocketProviderAdapter');

/**
 * ProviderAdapterResolver test
 */
describe('ProviderAdapterResolverTest', () => {
    let providerAdapterResolver,
        providersModuleFactory,
        providersModuleFactoryMock;

    beforeEach(() => {
        providersModuleFactory = new ProvidersModuleFactory();
        providersModuleFactoryMock = ProvidersModuleFactory.mock.instances[0];

        providerAdapterResolver = new ProviderAdapterResolver(providersModuleFactory);
    });

    it('calls resolve with HTTP url', () => {
        new HttpProvider('', {});
        const httpProviderMock = HttpProvider.mock.instances[0];

        new HttpProviderAdapter(httpProviderMock);
        const httpProviderAdapterMock = HttpProviderAdapter.mock.instances[0];

        providersModuleFactory.createHttpProvider
            .mockReturnValueOnce(httpProviderMock);

        providersModuleFactoryMock.createHttpProviderAdapter
            .mockReturnValueOnce(httpProviderAdapterMock);

        expect(providerAdapterResolver.resolve('http://localhost:8545'))
            .toBeInstanceOf(HttpProviderAdapter);

        expect(providersModuleFactoryMock.createHttpProviderAdapter)
            .toHaveBeenCalledWith(httpProviderMock);

        expect(providersModuleFactoryMock.createHttpProvider)
            .toHaveBeenCalledWith('http://localhost:8545');
    });

    it('calls resolve with WebSocket url', () => {
        new WebsocketProvider('', {});
        const websocketProviderMock = WebsocketProvider.mock.instances[0];

        new SocketProviderAdapter(websocketProviderMock);
        const socketProviderAdapterMock = SocketProviderAdapter.mock.instances[0];

        providersModuleFactory.createWebsocketProvider
            .mockReturnValueOnce(websocketProviderMock);

        providersModuleFactoryMock.createSocketProviderAdapter
            .mockReturnValueOnce(socketProviderAdapterMock);

        expect(providerAdapterResolver.resolve('ws://127.0.0.1:8545'))
            .toBeInstanceOf(SocketProviderAdapter);

        expect(providersModuleFactoryMock.createSocketProviderAdapter)
            .toHaveBeenCalledWith(websocketProviderMock);

        expect(providersModuleFactoryMock.createWebsocketProvider)
            .toHaveBeenCalledWith('ws://127.0.0.1:8545');
    });

    it('calls resolve with Ipc path and net object', () => {
        const net = {connect: () => {}};

        new SocketProviderAdapter({});
        const socketProviderAdapterMock = SocketProviderAdapter.mock.instances[0];

        new IpcProvider('', {});
        const ipcProviderMock = IpcProvider.mock.instances[0];

        providersModuleFactory.createIpcProvider
            .mockReturnValueOnce(ipcProviderMock);

        providersModuleFactoryMock.createSocketProviderAdapter
            .mockReturnValueOnce(socketProviderAdapterMock);

        expect(providerAdapterResolver.resolve('/path/to/the/socket', net))
            .toBeInstanceOf(SocketProviderAdapter);

        expect(providersModuleFactoryMock.createSocketProviderAdapter)
            .toHaveBeenCalledWith(ipcProviderMock);

        expect(providersModuleFactoryMock.createIpcProvider)
            .toHaveBeenCalledWith('/path/to/the/socket', net);
    });

    it('calls resolve with the HttpProvider', () => {
        new HttpProvider('', {});
        const httpProviderMock = HttpProvider.mock.instances[0];

        new HttpProviderAdapter(httpProviderMock);
        const httpProviderAdapterMock = HttpProviderAdapter.mock.instances[0];

        providersModuleFactoryMock.createHttpProviderAdapter
            .mockReturnValueOnce(httpProviderAdapterMock);

        expect(providerAdapterResolver.resolve(httpProviderMock))
            .toBeInstanceOf(HttpProviderAdapter);

        expect(providersModuleFactoryMock.createHttpProviderAdapter)
            .toHaveBeenCalledWith(httpProviderMock);
    });

    it('calls resolve with the EthereumProvider', () => {
        function EthereumProvider() {};

        new SocketProviderAdapter({});
        const socketProviderAdapterMock = SocketProviderAdapter.mock.instances[0];

        providersModuleFactoryMock.createSocketProviderAdapter
            .mockReturnValueOnce(socketProviderAdapterMock);

        expect(providerAdapterResolver.resolve(new EthereumProvider()))
            .toBeInstanceOf(SocketProviderAdapter);

        expect(providersModuleFactoryMock.createSocketProviderAdapter)
            .toHaveBeenCalledWith(new EthereumProvider());
    });

    it('calls resolve with the WebsocketProvider', () => {
        new WebsocketProvider('', {});
        const websocketProviderMock = WebsocketProvider.mock.instances[0];

        new SocketProviderAdapter({});
        const socketProviderAdapterMock = SocketProviderAdapter.mock.instances[0];

        providersModuleFactoryMock.createSocketProviderAdapter
            .mockReturnValueOnce(socketProviderAdapterMock);

        expect(providerAdapterResolver.resolve(websocketProviderMock))
            .toBeInstanceOf(SocketProviderAdapter);

        expect(providersModuleFactoryMock.createSocketProviderAdapter)
            .toHaveBeenCalledWith(websocketProviderMock);
    });

    it('calls resolve with the IpcProvider', () => {
        new IpcProvider('', {});
        const ipcProviderMock = IpcProvider.mock.instances[0];

        new SocketProviderAdapter({});
        const socketProviderAdapterMock = SocketProviderAdapter.mock.instances[0];

        providersModuleFactoryMock.createSocketProviderAdapter
            .mockReturnValueOnce(socketProviderAdapterMock);

        expect(providerAdapterResolver.resolve(ipcProviderMock))
            .toBeInstanceOf(SocketProviderAdapter);

        expect(providersModuleFactoryMock.createSocketProviderAdapter)
            .toHaveBeenCalledWith(ipcProviderMock);
    });

    it('calls resolve with the HttpProviderAdapter', () => {
        new HttpProviderAdapter({});
        const httpProviderAdapterMock = HttpProviderAdapter.mock.instances[0];

        expect(providerAdapterResolver.resolve(httpProviderAdapterMock))
            .toBeInstanceOf(HttpProviderAdapter);
    });

    it('calls resolve with the SocketProviderAdapter', () => {
        new SocketProviderAdapter({});
        const socketProviderAdapterMock = SocketProviderAdapter.mock.instances[0];

        expect(providerAdapterResolver.resolve(socketProviderAdapterMock))
            .toBeInstanceOf(SocketProviderAdapter);
    });

    it('calls resolve with a provider that isn\'t supported', () => {
        expect(() => {
            providerAdapterResolver.resolve('LALALA')
        }).toThrow(Error)
    });
});
