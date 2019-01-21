import AbstractWeb3Module from '../../__mocks__/AbstractWeb3Module';
import JsonRpcMapper from '../../../src/mappers/JsonRpcMapper';
import JsonRpcResponseValidator from '../../../src/validators/JsonRpcResponseValidator';
import AbstractMethod from '../../__mocks__/AbstractMethod';
import MistEthereumProvider from '../../../src/providers/MistEthereumProvider';

/**
 * MistEthereumProvider test
 */
describe('MistEthereumProviderTest', () => {
    let mistEthereumProvider, ethereumProvider;

    beforeEach(() => {
        ethereumProvider = {on: jest.fn(), isConnected: jest.fn()};
        mistEthereumProvider = new MistEthereumProvider(ethereumProvider);
    });

    it('constructor check', () => {
        expect(mistEthereumProvider.connection).toEqual(ethereumProvider);

        expect(mistEthereumProvider.host).toEqual('mist');

        expect(mistEthereumProvider.timeout).toEqual(null);
    });


    it('calls registerEventListeners and the expected listeners will be registered', () => {
        mistEthereumProvider.registerEventListeners();

        expect(ethereumProvider.on.mock.calls[0][0]).toEqual('data');
        expect(ethereumProvider.on.mock.calls[0][1]).toBeInstanceOf(Function);

        expect(ethereumProvider.on.mock.calls[1][0]).toEqual('error');
        expect(ethereumProvider.on.mock.calls[1][1]).toBeInstanceOf(Function);

        expect(ethereumProvider.on.mock.calls[2][0]).toEqual('connect');
        expect(ethereumProvider.on.mock.calls[2][1]).toBeInstanceOf(Function);

        expect(ethereumProvider.on.mock.calls[3][0]).toEqual('connect');
        expect(ethereumProvider.on.mock.calls[3][1]).toBeInstanceOf(Function);

        expect(ethereumProvider.on.mock.calls[4][0]).toEqual('end');
        expect(ethereumProvider.on.mock.calls[4][1]).toBeInstanceOf(Function);
    });
    it('calls disconnect and returns true', () => {
        expect(mistEthereumProvider.disconnect()).toEqual(true);
    });

    it('calls connected and returns true', () => {
        ethereumProvider.isConnected.mockReturnValueOnce(true);

        expect(mistEthereumProvider.connected).toEqual(true);

        expect(ethereumProvider.isConnected).toHaveBeenCalled();
    });

    it('calls removeAllListeners and executes the expected methods', () => {
        ethereumProvider.removeListener = jest.fn();

        mistEthereumProvider.removeAllListeners('socket_message');
        mistEthereumProvider.removeAllListeners('socket_error');
        mistEthereumProvider.removeAllListeners('socket_connect');
        mistEthereumProvider.removeAllListeners('socket_ready');
        mistEthereumProvider.removeAllListeners('socket_close');

        expect(ethereumProvider.removeListener).toHaveBeenNthCalledWith(1, 'data', mistEthereumProvider.onMessage);
        expect(ethereumProvider.removeListener).toHaveBeenNthCalledWith(2, 'error', mistEthereumProvider.onError);
        expect(ethereumProvider.removeListener).toHaveBeenNthCalledWith(3, 'connect', mistEthereumProvider.onConnect);
        expect(ethereumProvider.removeListener).toHaveBeenNthCalledWith(4, 'connect', mistEthereumProvider.onConnect);
        expect(ethereumProvider.removeListener).toHaveBeenNthCalledWith(5, 'end', mistEthereumProvider.onClose);
    });

    it('calls send and returns with an resolved promise', async () => {
        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        JsonRpcResponseValidator.validate = jest.fn();
        JsonRpcResponseValidator.validate.mockReturnValueOnce(true);

        ethereumProvider.send = jest.fn((payload, callback) => {
            expect(callback).toBeInstanceOf(Function);

            expect(payload).toEqual({id: '0x0'});

            callback(false, {result: true});
        });

        const response = await mistEthereumProvider.send('rpc_method', []);

        expect(response).toEqual(true);

        expect(ethereumProvider.send).toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalledWith({result: true});
    });

    it('calls send and returns with an rejected promise', async () => {
        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        ethereumProvider.send = jest.fn((payload, callback) => {
            expect(callback).toBeInstanceOf(Function);

            expect(payload).toEqual({id: '0x0'});

            callback(true, {result: true});
        });

        await expect(mistEthereumProvider.send('rpc_method', [])).rejects.toEqual(true);

        expect(ethereumProvider.send).toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);
    });

    it('calls sendBatch and returns with an resolved promise', async () => {
        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        JsonRpcResponseValidator.validate = jest.fn();
        JsonRpcResponseValidator.validate.mockReturnValueOnce(true);

        ethereumProvider.send = jest.fn((payload, callback) => {
            expect(callback).toBeInstanceOf(Function);

            expect(payload).toEqual([{id: '0x0'}]);

            callback(false, {result: true});
        });

        const moduleInstanceMock = new AbstractWeb3Module();

        const abstractMethodMock = new AbstractMethod();
        abstractMethodMock.beforeExecution = jest.fn();
        abstractMethodMock.rpcMethod = 'rpc_method';
        abstractMethodMock.parameters = [];

        const response = await mistEthereumProvider.sendBatch([abstractMethodMock], moduleInstanceMock);

        expect(response).toEqual({result: true});

        expect(ethereumProvider.send).toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);
    });

    it('calls sendBatch and returns with an rejected promise', async () => {
        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        JsonRpcResponseValidator.validate = jest.fn();
        JsonRpcResponseValidator.validate.mockReturnValueOnce(true);

        ethereumProvider.send = jest.fn((payload, callback) => {
            expect(callback).toBeInstanceOf(Function);

            expect(payload).toEqual([{id: '0x0'}]);

            callback(true, {result: true});
        });

        const moduleInstanceMock = new AbstractWeb3Module();

        const abstractMethodMock = new AbstractMethod();
        abstractMethodMock.beforeExecution = jest.fn();
        abstractMethodMock.rpcMethod = 'rpc_method';
        abstractMethodMock.parameters = [];

        await expect(mistEthereumProvider.sendBatch([abstractMethodMock], moduleInstanceMock)).rejects.toEqual(true);

        expect(ethereumProvider.send).toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);
    });

    it('calls sendPayload and returns with an resolved promise', async () => {
        ethereumProvider.send = jest.fn((payload, callback) => {
            expect(callback).toBeInstanceOf(Function);

            expect(payload).toEqual({id: 0});

            callback(false, true);
        });

        const response = await mistEthereumProvider.sendPayload({id: 0});

        expect(response).toEqual(true);

        expect(ethereumProvider.send).toHaveBeenCalled();
    });

    it('calls sendPayload and returns with an rejected promise', async () => {
        ethereumProvider.send = jest.fn((payload, callback) => {
            expect(callback).toBeInstanceOf(Function);

            expect(payload).toEqual({id: 0});

            callback(true, false);
        });

        await expect(mistEthereumProvider.sendPayload({id: 0})).rejects.toEqual(true);

        expect(ethereumProvider.send).toHaveBeenCalled();
    });
});
