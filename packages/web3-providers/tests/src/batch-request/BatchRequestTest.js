import BatchRequest from '../../../src/batch-request/BatchRequest';
import JsonRpcMapper from '../../../src/mappers/JsonRpcMapper';
import JsonRpcResponseValidator from '../../../src/validators/JsonRpcResponseValidator';
import SocketProviderAdapter from '../../../src/adapters/SocketProviderAdapter';
import AbstractMethod from '../../__mocks__/AbstractMethod';

// Mocks
jest.mock('../../../src/adapters/SocketProviderAdapter');

/**
 * BatchRequest test
 */
describe('BatchRequestTest', () => {
    let batchRequest,
        providerAdapter,
        providerAdapterMock,
        abstractMethodMock,
        batchPayload;

    beforeEach(() => {
        providerAdapter = new SocketProviderAdapter({});
        providerAdapterMock = SocketProviderAdapter.mock.instances[0];

        abstractMethodMock = new AbstractMethod();
        abstractMethodMock.rpcMethod = 'rpc_method';
        abstractMethodMock.parameters = [true];
        abstractMethodMock.afterExecution = jest.fn();
        abstractMethodMock.callback = jest.fn();

        batchPayload = [{
            jsonrpc: '2.0',
            id: 0,
            method: 'rpc_method',
            params: [true]
        }];

        batchRequest = new BatchRequest(providerAdapterMock);
    });

    it('calls add with a invalid parameter', () => {
        expect(() => {
            batchRequest.add('asdf');
        }).toThrow(Error);
    });

    it('calls add with a valid parameter', () => {
        batchRequest.add(abstractMethodMock);
        expect(batchRequest.methods)
            .toEqual([abstractMethodMock]);
    });

    it('calls execute and returns a resolved promise and the callback got called with the expected results', async () => {
        JsonRpcResponseValidator.validate = jest.fn(() => {
            return true;
        });

        JsonRpcMapper.toBatchPayload = jest.fn((methods) => {
           expect(methods)
               .toEqual([abstractMethodMock]);

           return batchPayload;
        });

        providerAdapterMock.sendBatch = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual(batchPayload);

            callback(false, [{result: true}]);
        });

        abstractMethodMock.afterExecution
            .mockReturnValueOnce('RESULT');

        batchRequest.add(abstractMethodMock);
        const response = await batchRequest.execute();

        expect(response)
            .toEqual({
                methods: [abstractMethodMock],
                response: ['RESULT']
            });

        expect(abstractMethodMock.afterExecution)
            .toHaveBeenCalledWith(true);

        expect(JsonRpcResponseValidator.validate)
            .toHaveBeenCalled();

        expect(JsonRpcMapper.toBatchPayload)
            .toHaveBeenCalled();

        expect(abstractMethodMock.callback)
            .toHaveBeenCalledWith(false, 'RESULT');
    });

    it('calls execute and returns a rejected promise because of the provider', async () => {
        JsonRpcMapper.toBatchPayload = jest.fn((methods) => {
            expect(methods)
                .toEqual([abstractMethodMock]);

            return batchPayload;
        });

        providerAdapterMock.sendBatch = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual(batchPayload);

            callback(true, null);
        });

        batchRequest.add(abstractMethodMock);
        await expect(batchRequest.execute()).rejects
            .toEqual(true);

        expect(JsonRpcMapper.toBatchPayload)
            .toHaveBeenCalled();
    });

    it('calls execute and returns a rejected promise because the response is not of type Array', async () => {
        JsonRpcMapper.toBatchPayload = jest.fn((methods) => {
            expect(methods)
                .toEqual([abstractMethodMock]);

            return batchPayload;
        });

        providerAdapterMock.sendBatch = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual(batchPayload);

            callback(false, false);
        });

        batchRequest.add(abstractMethodMock);
        await expect(batchRequest.execute()).rejects
            .toEqual([new Error('Response should be of type Array but is: boolean')]);

        expect(JsonRpcMapper.toBatchPayload)
            .toHaveBeenCalled();

        expect(abstractMethodMock.callback)
            .toHaveBeenCalledWith(new Error('Response should be of type Array but is: boolean'), null);
    });

    it('calls execute and returns a rejected promise because of an node error', async () => {
        JsonRpcMapper.toBatchPayload = jest.fn((methods) => {
            expect(methods)
                .toEqual([abstractMethodMock]);

            return batchPayload;
        });

        providerAdapterMock.sendBatch = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual(batchPayload);

            callback(false, [{
                error: true
            }]);
        });

        batchRequest.add(abstractMethodMock);
        await expect(batchRequest.execute()).rejects
            .toEqual([new Error('Returned node error: true')]);

        expect(JsonRpcMapper.toBatchPayload)
            .toHaveBeenCalled();

        expect(abstractMethodMock.callback)
            .toHaveBeenCalledWith(new Error('Returned node error: true'), null);
    });

    it('calls execute and returns a rejected promise because of an node error', async () => {
        JsonRpcResponseValidator.validate = jest.fn(() => {
            return false;
        });

        JsonRpcMapper.toBatchPayload = jest.fn((methods) => {
            expect(methods)
                .toEqual([abstractMethodMock]);

            return batchPayload;
        });

        providerAdapterMock.sendBatch = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual(batchPayload);

            callback(false, ['NOPE']);
        });

        batchRequest.add(abstractMethodMock);
        await expect(batchRequest.execute()).rejects
            .toEqual([new Error('Invalid JSON RPC response: "NOPE"')]);

        expect(JsonRpcResponseValidator.validate)
            .toHaveBeenCalled();

        expect(JsonRpcMapper.toBatchPayload)
            .toHaveBeenCalled();

        expect(abstractMethodMock.callback)
            .toHaveBeenCalledWith(new Error('Invalid JSON RPC response: "NOPE"'), null);
    });

    it('calls execute and returns a rejected promise because of the afterExecution method', async () => {
        JsonRpcResponseValidator.validate = jest.fn(() => {
            return true;
        });

        JsonRpcMapper.toBatchPayload = jest.fn((methods) => {
            expect(methods)
                .toEqual([abstractMethodMock]);

            return batchPayload;
        });

        providerAdapterMock.sendBatch = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual(batchPayload);

            callback(false, [{result: true}]);
        });

        abstractMethodMock.afterExecution = jest.fn(() => {
            throw new Error('ERROR');
        });

        batchRequest.add(abstractMethodMock);
        await expect(batchRequest.execute()).rejects
            .toEqual([new Error('ERROR')]);

        expect(abstractMethodMock.afterExecution)
            .toHaveBeenCalledWith(true);

        expect(JsonRpcResponseValidator.validate)
            .toHaveBeenCalled();

        expect(JsonRpcMapper.toBatchPayload)
            .toHaveBeenCalled();

        expect(abstractMethodMock.callback)
            .toHaveBeenCalledWith(new Error('ERROR'), null);
    });

    it('calls execute and returns a rejected promise because of an empty response array', async () => {
        JsonRpcResponseValidator.validate = jest.fn(() => {
            return false;
        });

        JsonRpcMapper.toBatchPayload = jest.fn((methods) => {
            expect(methods)
                .toEqual([abstractMethodMock]);

            return batchPayload;
        });

        providerAdapterMock.sendBatch = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual(batchPayload);

            callback(false, []);
        });

        batchRequest.add(abstractMethodMock);
        await expect(batchRequest.execute()).rejects
            .toEqual([new Error('Invalid JSON RPC response: null')]);

        expect(JsonRpcResponseValidator.validate)
            .toHaveBeenCalled();

        expect(JsonRpcMapper.toBatchPayload)
            .toHaveBeenCalled();

        expect(abstractMethodMock.callback)
            .toHaveBeenCalledWith(new Error('Invalid JSON RPC response: null'), null);
    });
});
