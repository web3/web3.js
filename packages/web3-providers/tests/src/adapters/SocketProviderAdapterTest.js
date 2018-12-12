import SocketProviderAdapter from '../../../src/adapters/SocketProviderAdapter';
import WebsocketProvider from '../../../src/providers/WebsocketProvider';
import AbstractProviderAdapter from '../../../lib/adapters/AbstractProviderAdapter';
import JsonRpcMapper from '../../../src/mappers/JsonRpcMapper';
import JsonRpcResponseValidator from '../../../src/validators/JsonRpcResponseValidator';

// Mocks
jest.mock('../../../src/providers/WebsocketProvider');
jest.mock('../../../src/mappers/JsonRpcMapper');
jest.mock('../../../src/validators/JsonRpcResponseValidator');

/**
 * SocketProviderAdapter test
 */
describe('SocketProviderAdapterTest', () => {
    let socketProviderAdapter,
        websocketProvider,
        websocketProviderMock;

    beforeEach(() => {
        websocketProvider = new WebsocketProvider();
        websocketProviderMock = WebsocketProvider.mock.instances[0];
        websocketProviderMock.path = 'PATH';

        socketProviderAdapter = new SocketProviderAdapter(websocketProviderMock);
    });

    it('constructor check', () => {
        websocketProviderMock.on = jest.fn((eventName, callback) => {
            expect(eventName)
                .toEqual('data');
        });

        expect(socketProviderAdapter.provider)
            .toEqual(websocketProviderMock);

        expect(socketProviderAdapter)
            .toBeInstanceOf(AbstractProviderAdapter);

        expect(socketProviderAdapter.host)
            .toEqual(websocketProviderMock.path);

        expect(socketProviderAdapter.subscriptions)
            .toEqual([]);
    });

    it('calls subscribe and returns the subscriptionId', async () => {
        JsonRpcResponseValidator.validate = jest.fn(() => {
           return true;
        });

        JsonRpcMapper.toPayload = jest.fn((method, parameters) => {
            expect(method)
                .toEqual('eth');

            expect(parameters)
                .toEqual(['logs']);

            return {
                id: 0,
                jsonrpc: '2.0',
                params: ['logs'],
                method: 'eth',
            };
        });

        websocketProviderMock.send = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual({
                    id: 0,
                    jsonrpc: '2.0',
                    params: ['logs'],
                    method: 'eth',
                });

            callback(false, {result: 'SUBSCRIPTION_ID'});
        });


        const response = await socketProviderAdapter.subscribe('eth', 'logs', []);

        expect(response)
            .toEqual('SUBSCRIPTION_ID');

        expect(socketProviderAdapter.subscriptions[0])
            .toEqual('SUBSCRIPTION_ID');

        expect(JsonRpcResponseValidator.validate)
            .toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload)
            .toHaveBeenCalled();
    });

    it('calls subscribe and throws an error', async () => {
        JsonRpcMapper.toPayload = jest.fn((method, parameters) => {
            expect(method)
                .toEqual('eth');

            expect(parameters)
                .toEqual(['logs']);

            return {
                id: 0,
                jsonrpc: '2.0',
                params: ['logs'],
                method: 'eth',
            };
        });

        websocketProviderMock.send = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual({
                    id: 0,
                    jsonrpc: '2.0',
                    params: ['logs'],
                    method: 'eth',
                });

            callback(true, false);
        });


        await expect(socketProviderAdapter.subscribe('eth', 'logs', [])).rejects
            .toBeInstanceOf(Error);

        expect(JsonRpcMapper.toPayload)
            .toHaveBeenCalled();
    });

    it('calls unsubscribe and returns true', async () => {
        JsonRpcResponseValidator.validate = jest.fn(() => {
            return true;
        });

        JsonRpcMapper.toPayload = jest.fn((method, parameters) => {
            expect(method)
                .toEqual('unsubscribe');

            expect(parameters)
                .toEqual(['ID']);

            return {
                id: 0,
                jsonrpc: '2.0',
                params: ['ID'],
                method: 'unsubscribe',
            };
        });

        websocketProviderMock.send = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual({
                    id: 0,
                    jsonrpc: '2.0',
                    params: ['ID'],
                    method: 'unsubscribe',
                });

            callback(false, {result: true});
        });

        socketProviderAdapter.subscriptions = ['ID'];
        const response = await socketProviderAdapter.unsubscribe('ID', 'unsubscribe');

        expect(response)
            .toEqual(true);

        expect(socketProviderAdapter.subscriptions[0])
            .toEqual(undefined);

        expect(JsonRpcResponseValidator.validate)
            .toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload)
            .toHaveBeenCalled();
    });

    it('calls unsubscribe and returns false', async () => {
        JsonRpcResponseValidator.validate = jest.fn(() => {
            return true;
        });

        JsonRpcMapper.toPayload = jest.fn((method, parameters) => {
            expect(method)
                .toEqual('unsubscribe');

            expect(parameters)
                .toEqual(['ID']);

            return {
                id: 0,
                jsonrpc: '2.0',
                params: ['ID'],
                method: 'unsubscribe',
            };
        });

        websocketProviderMock.send = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual({
                    id: 0,
                    jsonrpc: '2.0',
                    params: ['ID'],
                    method: 'unsubscribe',
                });

            callback(false, {result: false});
        });

        socketProviderAdapter.subscriptions = ['ID'];
        const response = await socketProviderAdapter.unsubscribe('ID', 'unsubscribe');

        expect(response)
            .toEqual(false);

        expect(socketProviderAdapter.subscriptions[0])
            .toEqual('ID');

        expect(JsonRpcResponseValidator.validate)
            .toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload)
            .toHaveBeenCalled();
    });

    it('calls clearSubscriptions and returns true', async () => {
        JsonRpcResponseValidator.validate = jest.fn(() => {
            return true;
        });

        JsonRpcMapper.toPayload = jest.fn((method, parameters) => {
            expect(method)
                .toEqual('eth_unsubscribe');

            expect(parameters)
                .toEqual(['ID']);

            return {
                id: 0,
                jsonrpc: '2.0',
                params: ['ID'],
                method: 'eth_unsubscribe',
            };
        });

        websocketProviderMock.reset = jest.fn();

        websocketProviderMock.send = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual({
                    id: 0,
                    jsonrpc: '2.0',
                    params: ['ID'],
                    method: 'eth_unsubscribe',
                });

            callback(false, {result: true});
        });

        socketProviderAdapter.subscriptions = ['ID'];
        const response = await socketProviderAdapter.clearSubscriptions();

        expect(response)
            .toEqual(true);

        expect(socketProviderAdapter.subscriptions[0])
            .toEqual(undefined);

        expect(JsonRpcResponseValidator.validate)
            .toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload)
            .toHaveBeenCalled();

        expect(websocketProviderMock.reset)
            .toHaveBeenCalled();
    });


    it('calls clearSubscriptions and it throws an error', async () => {
        JsonRpcResponseValidator.validate = jest.fn(() => {
            return true;
        });

        JsonRpcMapper.toPayload = jest.fn((method, parameters) => {
            expect(method)
                .toEqual('eth_unsubscribe');

            expect(parameters)
                .toEqual(['ID']);

            return {
                id: 0,
                jsonrpc: '2.0',
                params: ['ID'],
                method: 'eth_unsubscribe',
            };
        });

        websocketProviderMock.reset = jest.fn();

        websocketProviderMock.send = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual({
                    id: 0,
                    jsonrpc: '2.0',
                    params: ['ID'],
                    method: 'eth_unsubscribe',
                });

            callback(false, {result: false});
        });

        socketProviderAdapter.subscriptions = ['ID'];

        await expect(socketProviderAdapter.clearSubscriptions()).rejects
            .toBeInstanceOf(Error);

        expect(socketProviderAdapter.subscriptions[0])
            .toEqual('ID');

        expect(JsonRpcResponseValidator.validate)
            .toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload)
            .toHaveBeenCalled();
    });

    it('calls removeSubscription and returns true', async () => {
        JsonRpcResponseValidator.validate = jest.fn(() => {
            return true;
        });

        JsonRpcMapper.toPayload = jest.fn((method, parameters) => {
            expect(method)
                .toEqual('eth_unsubscribe');

            expect(parameters)
                .toEqual(['ID']);

            return {
                id: 0,
                jsonrpc: '2.0',
                params: ['ID'],
                method: 'eth_unsubscribe',
            };
        });

        websocketProviderMock.reset = jest.fn();

        websocketProviderMock.send = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual({
                    id: 0,
                    jsonrpc: '2.0',
                    params: ['ID'],
                    method: 'eth_unsubscribe',
                });

            callback(false, {result: true});
        });

        socketProviderAdapter.subscriptions = ['ID'];

        const response = await socketProviderAdapter.removeSubscription('ID');

        expect(response)
            .toEqual(true);

        expect(socketProviderAdapter.subscriptions[0])
            .toEqual(undefined);

        expect(JsonRpcResponseValidator.validate)
            .toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload)
            .toHaveBeenCalled();
    });

    it('calls removeSubscription and throws an error', async () => {
        JsonRpcResponseValidator.validate = jest.fn(() => {
            return true;
        });

        JsonRpcMapper.toPayload = jest.fn((method, parameters) => {
            expect(method)
                .toEqual('eth_unsubscribe');

            expect(parameters)
                .toEqual(['ID']);

            return {
                id: 0,
                jsonrpc: '2.0',
                params: ['ID'],
                method: 'eth_unsubscribe',
            };
        });

        websocketProviderMock.reset = jest.fn();

        websocketProviderMock.send = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual({
                    id: 0,
                    jsonrpc: '2.0',
                    params: ['ID'],
                    method: 'eth_unsubscribe',
                });

            callback(false, {result: false});
        });

        socketProviderAdapter.subscriptions = ['ID'];

        await expect(socketProviderAdapter.removeSubscription('ID')).rejects
            .toBeInstanceOf(Error);

        expect(socketProviderAdapter.subscriptions[0])
            .toEqual('ID');

        expect(JsonRpcResponseValidator.validate)
            .toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload)
            .toHaveBeenCalled();
    });

    it('hasSubscription return true', () => {
        socketProviderAdapter.subscriptions = ['0x0'];
        expect(socketProviderAdapter.hasSubscription('0x0'))
    });

    it('hasSubscription return false', () => {
        socketProviderAdapter.subscriptions = ['0x0'];
        expect(socketProviderAdapter.hasSubscription('0x00'))
    });
});
