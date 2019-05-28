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

    it('calls execute and returns a resolved promise with the expected results', async () => {
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

    it('calls execute and calls the callback with the expected results', async () => {
        JsonRpcMapper.toPayload.mockReturnValueOnce({});

        JsonRpcResponseValidator.validate.mockReturnValueOnce(true);

        providerMock.sendPayload = jest.fn((payload) => {
            expect(payload).toEqual([{}]);

            return Promise.resolve([{result: true}]);
        });

        abstractMethodMock.afterExecution.mockReturnValueOnce('RESULT');
        abstractMethodMock.callback = jest.fn();

        batchRequest.add(abstractMethodMock);
        const response = await batchRequest.execute();

        expect(response).toEqual({
            methods: [abstractMethodMock],
            response: ['RESULT']
        });

        expect(abstractMethodMock.afterExecution).toHaveBeenCalledWith(true);

        expect(abstractMethodMock.callback).toHaveBeenCalledWith(false, 'RESULT');

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', [true]);

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalledWith({result: true});
    });

    it('calls execute and calls the callback with the error thrown from the afterExecution method', async () => {
        JsonRpcMapper.toPayload.mockReturnValueOnce({});

        JsonRpcResponseValidator.validate.mockReturnValueOnce(true);

        providerMock.sendPayload = jest.fn((payload) => {
            expect(payload).toEqual([{}]);

            return Promise.resolve([{result: true}]);
        });

        abstractMethodMock.afterExecution = jest.fn((response) => {
            expect(response).toEqual(true);

            throw new Error('ERROR');
        });

        abstractMethodMock.callback = jest.fn();

        batchRequest.add(abstractMethodMock);

        await expect(batchRequest.execute()).rejects.toEqual({
            errors: [{
                error: new Error('ERROR'),
                method: abstractMethodMock
            }],
            response: [{result: true}]
        });

        expect(abstractMethodMock.callback).toHaveBeenCalledWith(new Error('ERROR'), null);

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

    it('calls execute and the callback gets called beacuse the return value is not of type Array', (done) => {
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

    it('calls execute and the callback gets called with the validator error', (done) => {
        JsonRpcResponseValidator.validate.mockReturnValueOnce(new Error('false'));

        JsonRpcMapper.toPayload.mockReturnValueOnce({});

        providerMock.sendPayload = jest.fn((payload) => {
            expect(payload).toEqual([{}]);

            return Promise.resolve([]);
        });

        abstractMethodMock.callback = jest.fn((error, response) => {
            expect(error).toEqual(new Error('false'));

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

        await expect(batchRequest.execute()).rejects.toEqual({
            errors: [{
                error: new Error('false'),
                method: abstractMethodMock
            }],
            response: ['NOPE']
        });

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
        await expect(batchRequest.execute()).rejects.toEqual({
            errors: [{
                error: new Error('ERROR'),
                method: abstractMethodMock
            }],
            response: [{result: true}]
        });

        expect(abstractMethodMock.afterExecution).toHaveBeenCalledWith(true);

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', [true]);
    });

    it('calls execute with the EthSendTransactionMethod and returns a resolved promise', async () => {
        JsonRpcResponseValidator.validate.mockReturnValueOnce(true);

        JsonRpcMapper.toPayload.mockReturnValueOnce({});

        providerMock.sendPayload = jest.fn((payload) => {
            expect(payload).toEqual([{}]);

            return Promise.resolve([{result: true}]);
        });

        abstractMethodMock.Type = 'eth-send-transaction-method';
        batchRequest.add(abstractMethodMock);

        await expect(batchRequest.execute()).resolves.toEqual({
            methods: [abstractMethodMock],
            response: [true]
        });

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', [true]);
    });

    it('calls execute with accounts defined and returns a resolved promise', async () => {
        JsonRpcResponseValidator.validate.mockReturnValueOnce(false);

        JsonRpcMapper.toPayload.mockReturnValueOnce({});

        providerMock.sendPayload = jest.fn((payload) => {
            expect(payload).toEqual([{}]);

            return Promise.resolve([{result: true}]);
        });

        abstractMethodMock.Type = 'eth-send-transaction-method';
        abstractMethodMock.parameters = [{from: 0}];

        abstractMethodMock.hasAccounts = jest.fn();
        abstractMethodMock.hasAccounts.mockReturnValueOnce(true);

        abstractMethodMock.signTransaction = jest.fn();
        abstractMethodMock.signTransaction.mockReturnValueOnce(Promise.resolve({rawTransaction: '0x0'}));

        batchRequest.add(abstractMethodMock);

        batchRequest.moduleInstance.accounts = {wallet: [{nonce: 1}]};

        await expect(batchRequest.execute()).rejects.toEqual({
            errors: [{
                error: false,
                method: abstractMethodMock
            }],
            response: [{result: true}]
        });

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalled();

        expect(batchRequest.accounts).toEqual([{nonce: 0}]);

        expect(abstractMethodMock.hasAccounts).toHaveBeenCalled();

        expect(abstractMethodMock.parameters).toEqual(['0x0']);

        expect(abstractMethodMock.rpcMethod).toEqual('eth_sendRawTransaction');

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('eth_sendRawTransaction', ['0x0']);
    });
});
