import BatchRequest from '../../../src/batch-request/BatchRequest';
import JsonRpcMapper from '../../../src/mappers/JsonRpcMapper';
import JsonRpcResponseValidator from '../../../src/validators/JsonRpcResponseValidator';

// Mocks
jest.mock('');

/**
 * BatchRequest test
 */
describe('BatchRequestTest', () => {
    let batchRequest,
        providerAdapter,
        providerAdapterMock;
    beforeEach(() => {
        providerAdapter = new SocketProviderAdapter({});
        providerAdapterMock = SocketProviderAdapter.mock.instances[0];

        batchRequest = new BatchRequest(providerAdapterMock);
    });

    it('calls add which extends the requests array of the BatchRequest', () => {

    });

    it('calls execute and it calls the callback with the expected results', () => {

    });

    it('calls execute and results isn\'t of type Array', () => {

    });

    it('calls execute and results isn\'t of type Array', () => {

    });
});
