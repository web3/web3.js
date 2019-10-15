import JsonRpcMapper from '../../../src/mappers/JsonRpcMapper';
import JsonRpcResponseValidator from '../../../src/validators/JsonRpcResponseValidator';
import AbstractConfluxModule from '../../__mocks__/AbstractConfluxModule';
import AbstractMethod from '../../__mocks__/AbstractMethod';
import CustomProvider from '../../../src/providers/CustomProvider';

// Mocks
jest.mock('../../../src/factories/ProvidersModuleFactory');

/**
 * CustomProvider test
 */
describe('CustomProviderTest', () => {
    let customProvider, connectionMock;

    beforeEach(() => {
        connectionMock = {send: jest.fn(), sendAsync: jest.fn()};

        customProvider = new CustomProvider(connectionMock);
    });

    it('constructor check', () => {
        expect(customProvider.connection).toEqual(connectionMock);
    });

    it('calls supportsSubscriptions and returns false', () => {
        expect(customProvider.supportsSubscriptions()).toEqual(false);
    });

    it('calls subscribe and throws error', () => {
        expect(() => {
            customProvider.subscribe();
        }).toThrow('Subscriptions are not supported with the CustomProvider.');
    });

    it('calls unsubscribe and throws error', () => {
        expect(() => {
            customProvider.unsubscribe();
        }).toThrow('Subscriptions are not supported with the CustomProvider.');
    });

    it('calls send and returns with a resolved promise', async () => {
        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        JsonRpcResponseValidator.validate = jest.fn();
        JsonRpcResponseValidator.validate.mockReturnValueOnce(true);

        connectionMock.sendAsync = jest.fn((payload, callback) => {
            expect(payload).toEqual({id: '0x0'});

            callback(false, {result: true});
        });

        const response = await customProvider.send('rpc_method', []);

        expect(response).toEqual(true);

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalledWith({result: true});

        expect(connectionMock.sendAsync).toHaveBeenCalled();
    });

    it('calls send without the sendAsync method and returns with a resolved promise', async () => {
        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        JsonRpcResponseValidator.validate = jest.fn();
        JsonRpcResponseValidator.validate.mockReturnValueOnce(true);

        connectionMock.sendAsync = false;
        connectionMock.send = jest.fn((payload, callback) => {
            expect(payload).toEqual({id: '0x0'});

            callback(false, {result: true});
        });

        const response = await customProvider.send('rpc_method', []);

        expect(response).toEqual(true);

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalledWith({result: true});

        expect(connectionMock.send).toHaveBeenCalled();
    });

    it('calls send and returns with a rejected promise because of an invalid JSON-RPC response', async () => {
        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        JsonRpcResponseValidator.validate = jest.fn();
        JsonRpcResponseValidator.validate.mockReturnValueOnce(new Error('invalid'));

        connectionMock.sendAsync = jest.fn((payload, callback) => {
            expect(payload).toEqual({id: '0x0'});

            callback(false, true);
        });

        await expect(customProvider.send('rpc_method', [])).rejects.toThrow('invalid');

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalledWith(true);

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);

        expect(connectionMock.sendAsync).toHaveBeenCalled();
    });

    it('calls sendBatch and returns with a resolved promise', async () => {
        const abstractMethodMock = new AbstractMethod();

        const moduleInstanceMock = new AbstractConfluxModule();

        abstractMethodMock.beforeExecution = jest.fn();
        abstractMethodMock.rpcMethod = 'rpc_method';
        abstractMethodMock.parameters = [];

        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        connectionMock.sendAsync = jest.fn((payload, callback) => {
            expect(payload).toEqual([{id: '0x0'}]);

            callback(false, true);
        });

        const response = await customProvider.sendBatch([abstractMethodMock], moduleInstanceMock);

        expect(response).toEqual(true);

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);

        expect(connectionMock.sendAsync).toHaveBeenCalled();

        expect(abstractMethodMock.beforeExecution).toHaveBeenCalled();
    });
});
