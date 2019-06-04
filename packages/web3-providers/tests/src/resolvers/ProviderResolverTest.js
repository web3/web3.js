import ProviderResolver from '../../../src/resolvers/ProviderResolver';
import ProvidersModuleFactory from '../../../src/factories/ProvidersModuleFactory';
import HttpProvider from '../../../src/providers/HttpProvider';
import WebsocketProvider from '../../../src/providers/WebsocketProvider';
import IpcProvider from '../../../src/providers/IpcProvider';
import Web3EthereumProvider from '../../../src/providers/Web3EthereumProvider';
import MetamaskProvider from '../../../src/providers/MetamaskProvider';
import CustomProvider from '../../../src/providers/CustomProvider';

// Mocks
jest.mock('../../../src/factories/ProvidersModuleFactory');
jest.mock('../../../src/providers/HttpProvider');
jest.mock('../../../src/providers/WebsocketProvider');
jest.mock('../../../src/providers/IpcProvider');
jest.mock('../../../src/providers/MetamaskProvider');
jest.mock('../../../src/providers/CustomProvider');

/**
 * ProviderResolver test
 */
describe('ProviderResolverTest', () => {
    let providerResolver, providersModuleFactoryMock;

    beforeEach(() => {
        new ProvidersModuleFactory();
        providersModuleFactoryMock = ProvidersModuleFactory.mock.instances[0];

        providerResolver = new ProviderResolver(providersModuleFactoryMock);
    });

    it('calls resolve with null', () => {
        expect(providerResolver.resolve(null)).toEqual(null);
    });

    it('calls resolve with HTTP url', () => {
        new HttpProvider();
        const httpProviderMock = HttpProvider.mock.instances[0];

        providersModuleFactoryMock.createHttpProvider.mockReturnValueOnce(httpProviderMock);

        expect(providerResolver.resolve('http://localhost:8545')).toBeInstanceOf(HttpProvider);

        expect(providersModuleFactoryMock.createHttpProvider).toHaveBeenCalledWith('http://localhost:8545');
    });

    it('calls resolve with WebSocket url', () => {
        new WebsocketProvider({}, 1);
        const websocketProviderMock = WebsocketProvider.mock.instances[0];

        providersModuleFactoryMock.createWebsocketProvider.mockReturnValueOnce(websocketProviderMock);

        expect(providerResolver.resolve('ws://127.0.0.1:8545')).toBeInstanceOf(WebsocketProvider);

        expect(providersModuleFactoryMock.createWebsocketProvider).toHaveBeenCalledWith('ws://127.0.0.1:8545');
    });

    it('calls resolve with Ipc path and net object', () => {
        new IpcProvider({}, '/path/to/the/socket');
        const ipcProviderMock = IpcProvider.mock.instances[0];

        const net = {connect: () => {}};

        providersModuleFactoryMock.createIpcProvider.mockReturnValueOnce(ipcProviderMock);

        expect(providerResolver.resolve('/path/to/the/socket', net)).toBeInstanceOf(IpcProvider);

        expect(providersModuleFactoryMock.createIpcProvider).toHaveBeenCalledWith('/path/to/the/socket', net);
    });

    it('calls resolve with the HttpProvider', () => {
        new HttpProvider();
        const httpProviderMock = HttpProvider.mock.instances[0];

        expect(providerResolver.resolve(httpProviderMock)).toBeInstanceOf(HttpProvider);
    });

    it('calls resolve with the EthereumProvider', () => {
        const ethereumProviderMock = {};
        ethereumProviderMock.isEIP1193 = true;

        providersModuleFactoryMock.createWeb3EthereumProvider.mockReturnValueOnce(ethereumProviderMock);

        expect(providerResolver.resolve(ethereumProviderMock)).toEqual(ethereumProviderMock);

        expect(providersModuleFactoryMock.createWeb3EthereumProvider).toHaveBeenCalledWith(ethereumProviderMock);
    });

    it('calls resolve with the Web3EthereumProvider', () => {
        const ethereumProviderMock = {
            isEIP1193: true,
            on: () => {}
        };
        const web3EthereumProvider = new Web3EthereumProvider(ethereumProviderMock);

        expect(providerResolver.resolve(web3EthereumProvider)).toBeInstanceOf(Web3EthereumProvider);
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
        const metamaskInpageProvider = {constructor: {name: 'MetamaskInpageProvider'}};

        providersModuleFactoryMock.createMetamaskProvider.mockReturnValueOnce(metamaskProviderMock);

        expect(providerResolver.resolve(metamaskInpageProvider)).toEqual(metamaskProviderMock);

        expect(providersModuleFactoryMock.createMetamaskProvider).toHaveBeenCalledWith(metamaskInpageProvider);
    });

    it('calls resolve with a custom provider', () => {
        new CustomProvider();
        const customProviderMock = CustomProvider.mock.instances[0];

        providersModuleFactoryMock.createCustomProvider.mockReturnValueOnce(customProviderMock);

        expect(providerResolver.resolve({})).toEqual(customProviderMock);

        expect(providersModuleFactoryMock.createCustomProvider).toHaveBeenCalledWith({});
    });
});
