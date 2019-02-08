import ProviderResolver from '../../../src/resolvers/ProviderResolver';
import ProvidersModuleFactory from '../../../src/factories/ProvidersModuleFactory';
import HttpProvider from '../../../src/providers/HttpProvider';
import WebsocketProvider from '../../../src/providers/WebsocketProvider';
import IpcProvider from '../../../src/providers/IpcProvider';
import EthereumProvider from '../../../src/providers/EthereumProvider';
import MetamaskProvider from '../../../src/providers/MetamaskProvider';

// Mocks
jest.mock('../../../src/factories/ProvidersModuleFactory');
jest.mock('../../../src/providers/HttpProvider');
jest.mock('../../../src/providers/WebsocketProvider');
jest.mock('../../../src/providers/IpcProvider');
jest.mock('../../../src/providers/EthereumProvider');
jest.mock('../../../src/providers/MetamaskProvider');

/**
 * ProviderResolver test
 */
describe('ProviderResolverTest', () => {
    let providerResolver, providersModuleFactory, providersModuleFactoryMock;

    beforeEach(() => {
        providersModuleFactory = new ProvidersModuleFactory();
        providersModuleFactoryMock = ProvidersModuleFactory.mock.instances[0];

        providerResolver = new ProviderResolver(providersModuleFactory);
    });

    it('calls resolve with HTTP url', () => {
        new HttpProvider('host', {}, providersModuleFactoryMock);
        const httpProviderMock = HttpProvider.mock.instances[0];

        providersModuleFactory.createHttpProvider.mockReturnValueOnce(httpProviderMock);

        expect(providerResolver.resolve('http://localhost:8545')).toBeInstanceOf(HttpProvider);

        expect(providersModuleFactoryMock.createHttpProvider).toHaveBeenCalledWith('http://localhost:8545');
    });

    it('calls resolve with WebSocket url', () => {
        new WebsocketProvider({}, 1);
        const websocketProviderMock = WebsocketProvider.mock.instances[0];

        providersModuleFactory.createWebsocketProvider.mockReturnValueOnce(websocketProviderMock);

        expect(providerResolver.resolve('ws://127.0.0.1:8545')).toBeInstanceOf(WebsocketProvider);

        expect(providersModuleFactoryMock.createWebsocketProvider).toHaveBeenCalledWith('ws://127.0.0.1:8545');
    });

    it('calls resolve with Ipc path and net object', () => {
        new IpcProvider({}, '/path/to/the/socket');
        const ipcProviderMock = IpcProvider.mock.instances[0];

        const net = {connect: () => {}};

        providersModuleFactory.createIpcProvider.mockReturnValueOnce(ipcProviderMock);

        expect(providerResolver.resolve('/path/to/the/socket', net)).toBeInstanceOf(IpcProvider);

        expect(providersModuleFactoryMock.createIpcProvider).toHaveBeenCalledWith('/path/to/the/socket', net);
    });

    it('calls resolve with the HttpProvider', () => {
        new HttpProvider('host', {}, providersModuleFactoryMock);
        const httpProviderMock = HttpProvider.mock.instances[0];

        expect(providerResolver.resolve(httpProviderMock)).toBeInstanceOf(HttpProvider);
    });

    it('calls resolve with the EthereumProvider', () => {
        new EthereumProvider({});
        const ethereumProviderMock = EthereumProvider.mock.instances[0];
        ethereumProviderMock.isEIP1193 = true;

        providersModuleFactoryMock.createEthereumProvider.mockReturnValueOnce(ethereumProviderMock);

        expect(providerResolver.resolve(ethereumProviderMock)).toBeInstanceOf(EthereumProvider);

        expect(providersModuleFactoryMock.createEthereumProvider).toHaveBeenCalledWith(ethereumProviderMock);
    });

    it('calls resolve with the WebsocketProvider', () => {
        new WebsocketProvider({}, 1);
        const websocketProviderMock = WebsocketProvider.mock.instances[0];

        expect(providerResolver.resolve(websocketProviderMock)).toBeInstanceOf(WebsocketProvider);
    });

    it('calls resolve with the IpcProvider', () => {
        new IpcProvider({}, '/path/to/the/socket');
        const ipcProviderMock = IpcProvider.mock.instances[0];

        expect(providerResolver.resolve(ipcProviderMock)).toBeInstanceOf(IpcProvider);
    });

    it('calls resolve with the MetamaskProvider', () => {
        new MetamaskProvider();
        const metamaskProviderMock = MetamaskProvider.mock.instances[0];

        providersModuleFactoryMock.createMetamaskProvider.mockReturnValueOnce(metamaskProviderMock);

        expect(providerResolver.resolve(metamaskProviderMock)).toEqual(metamaskProviderMock);
    });
});
