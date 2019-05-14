import BatchRequest from '../../../src/batch-request/BatchRequest';
import JsonRpcResponseValidator from '../../../src/validators/JsonRpcResponseValidator';
import WebsocketProvider from '../../../src/providers/WebsocketProvider';
import AbstractMethod from '../../__mocks__/AbstractMethod';
import AbstractWeb3Module from '../../__mocks__/AbstractWeb3Module';
import JsonRpcMapper from '../../../src/mappers/JsonRpcMapper';

// Mocks
jest.mock('../../../src/providers/WebsocketProvider');
jest.mock('../../../src/mappers/JsonRpcMapper');
jest.mock('../../../src/validators/JsonRpcResponseValidator');

/**
 * BatchRequest test
 */
describe('BatchRequestTest', () => {
    let batchRequest, providerMock, abstractMethodMock, moduleInstanceMock;

    beforeEach(() => {
        new WebsocketProvider({}, 0);
        providerMock = WebsocketProvider.mock.instances[0];

        moduleInstanceMock = new AbstractWeb3Module();
        moduleInstanceMock.currentProvider = providerMock;

        abstractMethodMock = new AbstractMethod();
        abstractMethodMock.rpcMethod = 'rpc_method';
        abstractMethodMock.parameters = [true];
        abstractMethodMock.afterExecution = jest.fn();
        abstractMethodMock.beforeExecution = jest.fn();
        abstractMethodMock.callback = false;

        batchRequest = new BatchRequest(moduleInstanceMock);
    });

    it('calls add with a invalid parameter', () => {
        expect(() => {
            batchRequest.add('asdf');
        }).toThrow(Error);
    });

    it('calls add with a valid parameter', () => {
        batchRequest.add(abstractMethodMock);

        expect(batchRequest.methods).toEqual([abstractMethodMock]);
    });

    it('calls execute and returns a resolved promise and the callback got called with the expected results', async () => {
        JsonRpcMapper.toPayload.mockReturnValueOnce({});

        JsonRpcResponseValidator.validate.mockReturnValueOnce(true);

        providerMock.sendPayload = jest.fn((payload) => {
            expect(payload).toEqual([{}]);

            return Promise.resolve([{result: true}]);
        });

        abstractMethodMock.afterExecution.mockReturnValueOnce('RESULT');

        batchRequest.add(abstractMethodMock);
        const response = await batchRequest.execute();

        expect(response).toEqual({
            methods: [abstractMethodMock],
            response: ['RESULT']
        });

        expect(abstractMethodMock.afterExecution).toHaveBeenCalledWith(true);

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', [true]);

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalledWith({result: true});
    });

    it('calls execute and returns a rejected promise because of the provider', async () => {
        JsonRpcMapper.toPayload.mockReturnValueOnce({});

        providerMock.sendPayload = jest.fn((payload) => {
            expect(payload).toEqual([{}]);

            return Promise.reject(new Error('error'));
        });

        batchRequest.add(abstractMethodMock);

        await expect(batchRequest.execute()).rejects.toThrow(new Error('error'));

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', [true]);
    });

    it('calls execute and returns a rejected promise because the response is not of type Array', async () => {
        JsonRpcMapper.toPayload.mockReturnValueOnce({});

        providerMock.sendPayload = jest.fn((payload) => {
            expect(payload).toEqual([{}]);

            return Promise.resolve(false);
        });

        batchRequest.add(abstractMethodMock);

        await expect(batchRequest.execute()).rejects.toThrow(
            new Error('BatchRequest error: Response should be of type Array but is: boolean')
        );

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', [true]);
    });

    it('calls execute and the callback gets called', (done) => {
        JsonRpcMapper.toPayload.mockReturnValueOnce({});

        providerMock.sendPayload = jest.fn((payload) => {
            expect(payload).toEqual([{}]);

            return Promise.resolve(false);
        });

        abstractMethodMock.callback = jest.fn((error, response) => {
            expect(error).toEqual(new Error('BatchRequest error: Response should be of type Array but is: boolean'));

            expect(response).toEqual(null);

            expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', [true]);

            done();
        });

        batchRequest.add(abstractMethodMock);
        batchRequest.execute();
    });

    it('calls execute and returns a rejected promise because of an invalid JSON-RPC response', async () => {
        JsonRpcResponseValidator.validate.mockReturnValueOnce(new Error('false'));

        JsonRpcMapper.toPayload.mockReturnValueOnce({});

        providerMock.sendPayload = jest.fn((payload) => {
            expect(payload).toEqual([{}]);

            return Promise.resolve(['NOPE']);
        });

        batchRequest.add(abstractMethodMock);

        await expect(batchRequest.execute()).rejects.toThrow(new Error('Error: false'));

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', [true]);
    });

    it('calls execute and returns a rejected promise because of the afterExecution method', async () => {
        JsonRpcResponseValidator.validate.mockReturnValueOnce(true);

        JsonRpcMapper.toPayload.mockReturnValueOnce({});

        providerMock.sendPayload = jest.fn((payload) => {
            expect(payload).toEqual([{}]);

            return Promise.resolve([{result: true}]);
        });

        abstractMethodMock.afterExecution = jest.fn(() => {
            throw new Error('ERROR');
        });

        batchRequest.add(abstractMethodMock);
        await expect(batchRequest.execute()).rejects.toEqual(new Error('Error: ERROR'));

        expect(abstractMethodMock.afterExecution).toHaveBeenCalledWith(true);

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', [true]);
    });
});
