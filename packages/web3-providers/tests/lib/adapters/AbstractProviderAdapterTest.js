import EventEmitter from 'eventemitter3';
import AbstractProviderAdapter from '../../../lib/adapters/AbstractProviderAdapter';
import HttpProvider from '../../../src/providers/HttpProvider';
import JsonRpcMapper from '../../../src/mappers/JsonRpcMapper';

// Mocks
jest.mock('../../../src/providers/HttpProvider');

/**
 * AbstractProviderAdapter test
 */
describe('AbstractProviderAdapterTest', () => {
    let abstractProviderAdapter,
        httpProvider,
        httpProviderMock;

    beforeEach(() => {
        httpProvider = new HttpProvider('localhost', {});
        httpProviderMock = HttpProvider.mock.instances[0];

        JsonRpcMapper.toPayload = jest.fn(() => {
            return {
                id: 0,
                error: undefined,
                jsonrpc: '2.0'
            };
        });

        abstractProviderAdapter = new AbstractProviderAdapter(httpProviderMock);
    });

    it('constructor check', () => {
        expect(abstractProviderAdapter.provider)
            .toEqual(httpProviderMock);

        expect(abstractProviderAdapter)
            .toBeInstanceOf(EventEmitter);
    });

    it('calls send and returns a resolved promise', async () => {
        httpProviderMock.send = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual(JsonRpcMapper.toPayload());

            callback(
                false,
                {
                    id: 0,
                    error: undefined,
                    result: 'RESULT',
                    jsonrpc: '2.0'
                }
            );
        });

        const response = await abstractProviderAdapter.send('rpc_method', []);

        expect(response)
            .toEqual('RESULT');

        expect(httpProviderMock.send)
            .toHaveBeenCalled();
    });

    it('calls send and returns a rejected promise because of an invalid payload id', async () => {
        httpProviderMock.send = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual(JsonRpcMapper.toPayload());

            callback(
                false,
                {
                    id: 2,
                    error: undefined,
                    result: 'RESULT',
                    jsonrpc: '2.0'
                }
            );
        });

        await expect(abstractProviderAdapter.send('rpc_method', [])).rejects
            .toBeInstanceOf(Error);

        expect(httpProviderMock.send)
            .toHaveBeenCalled();
    });

    it('calls send and returns a rejected promise because of an provider error', async () => {
        httpProviderMock.send = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual(JsonRpcMapper.toPayload('rpc_method', []));

            callback('PROVIDER ERROR', null);
        });

        await expect(abstractProviderAdapter.send('rpc_method', [])).rejects
            .toEqual('PROVIDER ERROR');

        expect(httpProviderMock.send)
            .toHaveBeenCalled();
    });

    it('calls send and returns a rejected promise because of an node error (any)', async () => {
        httpProviderMock.send = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual(JsonRpcMapper.toPayload('rpc_method', []));

            callback(
                false,
                {
                    id: payload.id,
                    error: 'ERROR',
                }
            );
        });

        await expect(abstractProviderAdapter.send('rpc_method', [])).rejects
            .toBeInstanceOf(Error);

        expect(httpProviderMock.send)
            .toHaveBeenCalled();
    });

    it('calls send and returns a rejected promise because of an node error (error object)', async () => {
        httpProviderMock.send = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual(JsonRpcMapper.toPayload('rpc_method', []));

            callback(
                false,
                {
                    id: payload.id,
                    error: new Error('ERROR'),
                }
            );
        });

        await expect(abstractProviderAdapter.send('rpc_method', [])).rejects
            .toBeInstanceOf(Error);

        expect(httpProviderMock.send)
            .toHaveBeenCalled();
    });


    it('calls send and returns a rejected promise because of an invalid JSON-RPC response', async () => {
        httpProviderMock.send = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual(JsonRpcMapper.toPayload('rpc_method', []));

            callback(
                false,
                {
                    id: payload.id,
                    error: undefined,
                    jsonrpc: '2.0'
                }
            );
        });

        await expect(abstractProviderAdapter.send('rpc_method', [])).rejects
            .toBeInstanceOf(Error);

        expect(httpProviderMock.send)
            .toHaveBeenCalled();
    });

    it('sendBatch should just be a wrapper of the provider.send method', () => {
        httpProviderMock.send = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual(true);

            expect(callback)
                .toBeInstanceOf(Function);
        });

        abstractProviderAdapter.sendBatch(true, () => {});

        expect(httpProviderMock.send)
            .toHaveBeenCalled();
    });

    it('isConnected returns the connected property of the provider', () => {
        httpProviderMock.connected = 'CONNECTED';
        expect(abstractProviderAdapter.isConnected())
            .toEqual('CONNECTED');
    });

    it('subscribe returns a rejected promise', async () => {
        await expect(abstractProviderAdapter.subscribe()).rejects
            .toBeInstanceOf(Error);
    });

    it('unsubscribe returns a rejected promise', async () => {
        await expect(abstractProviderAdapter.unsubscribe()).rejects
            .toBeInstanceOf(Error);
    });
});
