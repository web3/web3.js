import ProviderAdapterResolver from '../../../src/resolvers/ProviderAdapterResolver';
import ProvidersModuleFactory from '../../../src/factories/ProvidersModuleFactory';

// Mocks
jest.mock('../../../src/factories/ProvidersModuleFactory');

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

    });

    it('calls resolve with WebSocket url', () => {

    });

    it('calls resolve with WebSocket url', () => {

    });

    it('calls resolve with Ipc path and net object', () => {

    });

    it('calls resolve with the HttpProvider', () => {

    });

    it('calls resolve with the EthereumProvider', () => {

    });

    it('calls resolve with the WebsocketProvider', () => {

    });

    it('calls resolve with the IpcProvider', () => {

    });

    it('calls resolve with the HttpProviderAdapter', () => {

    });

    it('calls resolve with the SocketProviderAdapter', () => {

    });

    it('calls resolve with a provider that isn\'t supported', () => {

    });
});
