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

        abstractProviderAdapter = new AbstractProviderAdapter(httpProviderMock);
    });

    it('constructor check', () => {
        expect(abstractProviderAdapter.provider)
            .toEqual(httpProviderMock);

        expect(abstractProviderAdapter)
            .toBeInstanceOf(EventEmitter);
    });

    it('calls send and get a resoled promise returned ', async () => {
        httpProviderMock.send = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual(JsonRpcMapper.toPayload('rpc_method', []));

            callback(
                false,
                {
                    id: payload.id,
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
            .toHaveBeenCalledWith(payload, Function)
    });


    it('calls send and get a rejected promise returned because of an provider error', async () => {
        httpProviderMock.send = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual(JsonRpcMapper.toPayload('rpc_method', []));

            callback('PROVIDER ERROR', null);
        });

        expect(
            await abstractProviderAdapter.send('rpc_method', [])
        ).rejects.toThrow('PROVIDER ERROR').then(() => {
            expect(httpProviderMock.send)
                .toHaveBeenCalledWith(payload, Function)
        });
    });

    it('calls send and get a rejected promise returned because of an node error', async () => {
        httpProviderMock.send = jest.fn((payload, callback) => {
            expect(payload)
                .toEqual(JsonRpcMapper.toPayload('rpc_method', []));

            callback(
                false,
                {
                    id: payload.id,
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
            .toHaveBeenCalledWith(payload, Function)
    });
});
