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
    });

    it('calls send and returns a rejected promise because of an provider error', async () => {
        httpProviderMock.send = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual(JsonRpcMapper.toPayload('rpc_method', []));

            callback('PROVIDER ERROR', null);
        });

        await expect(abstractProviderAdapter.send('rpc_method', [])).rejects
            .toEqual('PROVIDER ERROR');
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
    });
});
