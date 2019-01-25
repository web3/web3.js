import BatchRequest from '../../../src/batch-request/BatchRequest';
import JsonRpcResponseValidator from '../../../src/validators/JsonRpcResponseValidator';
import WebsocketProvider from '../../../src/providers/WebsocketProvider';
import AbstractMethod from '../../__mocks__/AbstractMethod';
import AbstractWeb3Module from '../../__mocks__/AbstractWeb3Module';

// Mocks
jest.mock('../../../src/providers/WebsocketProvider');

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
        abstractMethodMock.callback = jest.fn();

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
        JsonRpcResponseValidator.validate = jest.fn(() => {
            return true;
        });

        providerMock.sendBatch = jest.fn((methods, moduleInstance) => {
            expect(methods).toEqual([abstractMethodMock]);

            expect(moduleInstance).toEqual(moduleInstanceMock);

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

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalled();

        expect(abstractMethodMock.callback).toHaveBeenCalledWith(false, 'RESULT');
    });

    it('calls execute and returns a rejected promise because of the provider', async () => {
        providerMock.sendBatch = jest.fn((methods, moduleInstance) => {
            expect(methods).toEqual([abstractMethodMock]);

            expect(moduleInstance).toEqual(moduleInstanceMock);

            return Promise.reject(new Error('error'));
        });

        batchRequest.add(abstractMethodMock);
        await expect(batchRequest.execute()).rejects.toEqual(new Error('error'));
    });

    it('calls execute and returns a rejected promise because the response is not of type Array', async () => {
        providerMock.sendBatch = jest.fn((methods, moduleInstance) => {
            expect(methods).toEqual([abstractMethodMock]);

            expect(moduleInstance).toEqual(moduleInstanceMock);

            return Promise.resolve(false);
        });

        batchRequest.add(abstractMethodMock);
        await expect(batchRequest.execute()).rejects.toEqual(
            new Error('BatchRequest error: ["Response should be of type Array but is: boolean"]')
        );

        expect(abstractMethodMock.callback).toHaveBeenCalledWith(
            new Error('BatchRequest error: Response should be of type Array but is: boolean'),
            null
        );
    });

    it('calls execute and returns a rejected promise because of an node error', async () => {
        providerMock.sendBatch = jest.fn((methods, moduleInstance) => {
            expect(methods).toEqual([abstractMethodMock]);

            expect(moduleInstance).toEqual(moduleInstanceMock);

            return Promise.reject(new Error());
        });

        batchRequest.add(abstractMethodMock);
        await expect(batchRequest.execute()).rejects.toBeInstanceOf(Error);
    });

    it('calls execute and returns a rejected promise because of an invalid JSON-RPC response', async () => {
        JsonRpcResponseValidator.validate = jest.fn(() => {
            return false;
        });

        providerMock.sendBatch = jest.fn((methods, moduleInstance) => {
            expect(methods).toEqual([abstractMethodMock]);

            expect(moduleInstance).toEqual(moduleInstanceMock);

            return Promise.resolve(['NOPE']);
        });

        batchRequest.add(abstractMethodMock);
        await expect(batchRequest.execute()).rejects.toEqual(new Error('BatchRequest error: [false]'));

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalled();

        expect(abstractMethodMock.callback).toHaveBeenCalledWith(false, null);
    });

    it('calls execute and returns a rejected promise because of the afterExecution method', async () => {
        JsonRpcResponseValidator.validate = jest.fn(() => {
            return true;
        });

        providerMock.sendBatch = jest.fn((methods, moduleInstance) => {
            expect(methods).toEqual([abstractMethodMock]);

            expect(moduleInstance).toEqual(moduleInstanceMock);

            return Promise.resolve([{result: true}]);
        });

        abstractMethodMock.afterExecution = jest.fn(() => {
            throw new Error('ERROR');
        });

        batchRequest.add(abstractMethodMock);
        await expect(batchRequest.execute()).rejects.toEqual(new Error('BatchRequest error: [{}]'));

        expect(abstractMethodMock.afterExecution).toHaveBeenCalledWith(true);

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalled();

        expect(abstractMethodMock.callback).toHaveBeenCalledWith(new Error('ERROR'), null);
    });

    it('calls execute and returns a rejected promise because of an empty response array', async () => {
        JsonRpcResponseValidator.validate = jest.fn(() => {
            return false;
        });

        providerMock.sendBatch = jest.fn((methods, moduleInstance) => {
            expect(methods).toEqual([abstractMethodMock]);

            expect(moduleInstance).toEqual(moduleInstanceMock);

            return Promise.resolve([]);
        });

        batchRequest.add(abstractMethodMock);
        await expect(batchRequest.execute()).rejects.toEqual(new Error('BatchRequest error: [false]'));

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalled();

        expect(abstractMethodMock.callback).toHaveBeenCalledWith(false, null);
    });
});
