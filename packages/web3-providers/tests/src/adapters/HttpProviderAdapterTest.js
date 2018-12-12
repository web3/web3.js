import HttpProvider from '../../../src/providers/HttpProvider';
import HttpProviderAdapter from '../../../src/adapters/HttpProviderAdapter';
import AbstractProviderAdapter from '../../../lib/adapters/AbstractProviderAdapter';

// Mocks
jest.mock('../../../src/providers/HttpProvider');

/**
 * HttpProviderAdapter test
 */
describe('HttpProviderAdapterTest', () => {
    let httpProviderAdapter,
        httpProvider,
        httpProviderMock;

    beforeEach(() => {
        httpProvider = new HttpProvider('localhost', {});
        httpProviderMock = HttpProvider.mock.instances[0];
        httpProviderMock.host = 'http://127.0.0.1:4242';

        httpProviderAdapter = new HttpProviderAdapter(httpProvider);
    });

    it('constructor check', () => {
        expect(httpProviderAdapter.host)
            .toEqual(httpProviderMock.host);

        expect(httpProviderAdapter)
            .toBeInstanceOf(AbstractProviderAdapter);
    });
});
