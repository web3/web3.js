import ProvidersModuleFactory from '../../../src/factories/ProvidersModuleFactory';
import BatchRequest from '../../../src/batch-request/BatchRequest';
import ProviderAdapterResolver from '../../../src/resolvers/ProviderAdapterResolver';
import ProviderDetector from '../../../src/detectors/ProviderDetector';
import HttpProvider from '../../../src/providers/HttpProvider';
import WebsocketProvider from '../../../src/providers/WebsocketProvider';
import IpcProvider from '../../../src/providers/IpcProvider';
import HttpProviderAdapter from '../../../src/adapters/HttpProviderAdapter';
import SocketProviderAdapter from '../../../src/adapters/SocketProviderAdapter';

// Mocks
jest.mock('../../../src/batch-request/BatchRequest');
jest.mock('../../../src/resolvers/ProviderAdapterResolver');
jest.mock('../../../src/detectors/ProviderDetector');
jest.mock('../../../src/providers/HttpProvider');
jest.mock('../../../src/providers/WebsocketProvider');
jest.mock('../../../src/providers/IpcProvider');
jest.mock('../../../src/adapters/HttpProviderAdapter');
jest.mock('../../../src/adapters/SocketProviderAdapter');

/**
 * ProvidersModuleFactory test
 */
describe('ProvidersModuleFactoryTest', () => {
    let providersModuleFactory;

    beforeEach(() => {
        providersModuleFactory = new ProvidersModuleFactory();
    });

    it('createBatchRequest returns instance of BatchRequest', () => {
        expect(providersModuleFactory.createBatchRequest({}))
            .toBeInstanceOf(BatchRequest);
    });

    it('createProviderAdapterResolver returns instance of ProviderAdapterResolver', () => {
        expect(providersModuleFactory.createProviderAdapterResolver())
            .toBeInstanceOf(ProviderAdapterResolver);
    });

    it('createProviderDetector returns instance of ProviderDetector', () => {
        expect(providersModuleFactory.createProviderDetector())
            .toBeInstanceOf(ProviderDetector);
    });

    it('createHttpProvider returns instance of HttpProvider', () => {
        expect(providersModuleFactory.createHttpProvider(''))
            .toBeInstanceOf(HttpProvider);
    });

    it('createWebsocketProvider returns instance of WebsocketProvider', () => {
        expect(providersModuleFactory.createWebsocketProvider(''))
            .toBeInstanceOf(WebsocketProvider);
    });

    it('createIpcProvider returns instance of IpcProvider', () => {
        expect(providersModuleFactory.createIpcProvider('', {}))
            .toBeInstanceOf(IpcProvider);
    });

    it('createHttpProviderAdapter returns instance of HttpProviderAdapter', () => {
        expect(providersModuleFactory.createHttpProviderAdapter(''))
            .toBeInstanceOf(HttpProviderAdapter);
    });

    it('createSocketProviderAdapter returns instance of SocketProviderAdapter', () => {
        expect(providersModuleFactory.createSocketProviderAdapter(''))
            .toBeInstanceOf(SocketProviderAdapter);
    });
});
