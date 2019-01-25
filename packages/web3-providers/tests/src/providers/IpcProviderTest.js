import IpcProvider from '../../../src/providers/IpcProvider';
import AbstractSocketProvider from '../../../lib/providers/AbstractSocketProvider';
import JsonRpcResponseValidator from '../../../src/validators/JsonRpcResponseValidator';
import JsonRpcMapper from '../../../src/mappers/JsonRpcMapper';
import AbstractMethod from '../../__mocks__/AbstractMethod';
import AbstractWeb3Module from '../../__mocks__/AbstractWeb3Module';

// Mocks
jest.mock('../../../src/validators/JsonRpcResponseValidator');
jest.mock('../../../src/mappers/JsonRpcMapper');

/**
 * IpcProvider test
 */
describe('IpcProviderTest', () => {
    let ipcProvider, socketMock;

    beforeEach(() => {
        socketMock = {};
        socketMock.addListener = jest.fn();

        ipcProvider = new IpcProvider(socketMock, 'PATH');
    });

    it('constructor check', () => {
        expect(ipcProvider).toBeInstanceOf(AbstractSocketProvider);

        expect(ipcProvider.connection).toEqual(socketMock);

        expect(ipcProvider.host).toEqual('PATH');

        expect(socketMock.addListener.mock.calls[0][0]).toEqual('data');
        expect(socketMock.addListener.mock.calls[0][1]).toBeInstanceOf(Function);

        expect(socketMock.addListener.mock.calls[1][0]).toEqual('connect');
        expect(socketMock.addListener.mock.calls[1][1]).toBeInstanceOf(Function);

        expect(socketMock.addListener.mock.calls[2][0]).toEqual('error');
        expect(socketMock.addListener.mock.calls[2][1]).toBeInstanceOf(Function);

        expect(socketMock.addListener.mock.calls[3][0]).toEqual('end');
        expect(socketMock.addListener.mock.calls[3][1]).toBeInstanceOf(Function);

        expect(socketMock.addListener.mock.calls[4][0]).toEqual('close');
        expect(socketMock.addListener.mock.calls[4][1]).toBeInstanceOf(Function);

        expect(socketMock.addListener.mock.calls[5][0]).toEqual('timeout');
        expect(socketMock.addListener.mock.calls[5][1]).toBeInstanceOf(Function);

        expect(socketMock.addListener.mock.calls[6][0]).toEqual('ready');
        expect(socketMock.addListener.mock.calls[6][1]).toBeInstanceOf(Function);
    });

    it('calls disconnect', () => {
        socketMock.destroy = jest.fn();
        ipcProvider.disconnect();

        expect(socketMock.destroy).toHaveBeenCalled();
    });

    it('gets the connected property', () => {
        socketMock.pending = false;

        expect(ipcProvider.connected).toEqual(true);
    });

    it('calls reconnect', () => {
        socketMock.connect = jest.fn();

        ipcProvider.reconnect();

        expect(socketMock.connect).toHaveBeenCalledWith({path: ipcProvider.path});
    });

    it('calls onMessage', () => {
        const objWithToString = {
            toString: jest.fn(() => {
                return '{"id":"0x0"}';
            })
        };

        ipcProvider.onMessage(objWithToString);

        expect(objWithToString.toString).toHaveBeenCalled();
    });

    it('calls registEventListener with a Socket object as connection', () => {
        socketMock = function Socket() {};
        socketMock.addListener = jest.fn();

        ipcProvider = new IpcProvider(socketMock, 'PATH');

        ipcProvider.registerEventListeners();

        expect(socketMock.addListener.mock.calls[0][0]).toEqual('data');
        expect(socketMock.addListener.mock.calls[0][1]).toBeInstanceOf(Function);

        expect(socketMock.addListener.mock.calls[1][0]).toEqual('connect');
        expect(socketMock.addListener.mock.calls[1][1]).toBeInstanceOf(Function);

        expect(socketMock.addListener.mock.calls[2][0]).toEqual('error');
        expect(socketMock.addListener.mock.calls[2][1]).toBeInstanceOf(Function);

        expect(socketMock.addListener.mock.calls[3][0]).toEqual('end');
        expect(socketMock.addListener.mock.calls[3][1]).toBeInstanceOf(Function);

        expect(socketMock.addListener.mock.calls[4][0]).toEqual('close');
        expect(socketMock.addListener.mock.calls[4][1]).toBeInstanceOf(Function);

        expect(socketMock.addListener.mock.calls[5][0]).toEqual('timeout');
        expect(socketMock.addListener.mock.calls[5][1]).toBeInstanceOf(Function);

        expect(socketMock.addListener.mock.calls[6][0]).toEqual('ready');
        expect(socketMock.addListener.mock.calls[6][1]).toBeInstanceOf(Function);
    });

    it('calls registerEventListener', () => {
        socketMock.addListener = jest.fn();

        ipcProvider.registerEventListeners();

        expect(socketMock.addListener.mock.calls[0][0]).toEqual('data');
        expect(socketMock.addListener.mock.calls[0][1]).toBeInstanceOf(Function);

        expect(socketMock.addListener.mock.calls[1][0]).toEqual('connect');
        expect(socketMock.addListener.mock.calls[1][1]).toBeInstanceOf(Function);

        expect(socketMock.addListener.mock.calls[2][0]).toEqual('error');
        expect(socketMock.addListener.mock.calls[2][1]).toBeInstanceOf(Function);

        expect(socketMock.addListener.mock.calls[3][0]).toEqual('end');
        expect(socketMock.addListener.mock.calls[3][1]).toBeInstanceOf(Function);

        expect(socketMock.addListener.mock.calls[4][0]).toEqual('close');
        expect(socketMock.addListener.mock.calls[4][1]).toBeInstanceOf(Function);

        expect(socketMock.addListener.mock.calls[5][0]).toEqual('timeout');
        expect(socketMock.addListener.mock.calls[5][1]).toBeInstanceOf(Function);

        expect(socketMock.addListener.mock.calls[6][0]).toEqual('ready');
        expect(socketMock.addListener.mock.calls[6][1]).toBeInstanceOf(Function);
    });

    it('calls removeAllListeners with the "socket_message" event', () => {
        socketMock.removeEventListener = jest.fn();

        ipcProvider.removeAllListeners('socket_message');

        expect(socketMock.removeEventListener).toHaveBeenCalledWith('data', ipcProvider.onMessage);
    });

    it('calls removeAllListeners with the "socket_ready" event', () => {
        socketMock.removeEventListener = jest.fn();

        ipcProvider.removeAllListeners('socket_ready');

        expect(socketMock.removeEventListener).toHaveBeenCalledWith('ready', ipcProvider.onReady);
    });

    it('calls removeAllListeners with the "socket_close" event', () => {
        socketMock.removeEventListener = jest.fn();

        ipcProvider.removeAllListeners('socket_close');

        expect(socketMock.removeEventListener).toHaveBeenCalledWith('close', ipcProvider.onClose);
    });

    it('calls removeAllListeners with the "socket_error" event', () => {
        socketMock.removeEventListener = jest.fn();

        ipcProvider.removeAllListeners('socket_error');

        expect(socketMock.removeEventListener).toHaveBeenCalledWith('error', ipcProvider.onError);
    });

    it('calls removeAllListeners with the "socket_connect" event', () => {
        socketMock.removeEventListener = jest.fn();

        ipcProvider.removeAllListeners('socket_connect');

        expect(socketMock.removeEventListener).toHaveBeenCalledWith('connect', ipcProvider.onConnect);
    });

    it('calls send and returns a resolved promise', async () => {
        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        JsonRpcResponseValidator.validate = jest.fn();
        JsonRpcResponseValidator.validate.mockReturnValueOnce(true);

        socketMock.pending = false;
        socketMock.writable = true;

        socketMock.write = jest.fn((jsonString) => {
            expect(jsonString).toEqual('{"id":"0x0"}');

            return true;
        });

        setTimeout(() => {
            ipcProvider.emit('0x0', {result: true});
        }, 1);

        const response = await ipcProvider.send('rpc_method', []);

        expect(response).toEqual(true);

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalledWith({result: true});

        expect(ipcProvider.listenerCount('0x0')).toEqual(0);
    });

    it('calls send and returns a rejected promise because of an invalid rpc response', async () => {
        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        JsonRpcResponseValidator.validate = jest.fn();
        JsonRpcResponseValidator.validate.mockReturnValueOnce(new Error('invalid'));

        socketMock.pending = false;
        socketMock.writable = true;

        socketMock.write = jest.fn((jsonString) => {
            expect(jsonString).toEqual('{"id":"0x0"}');

            return true;
        });

        setTimeout(() => {
            ipcProvider.emit('0x0', {result: true});
        }, 1);

        await expect(ipcProvider.send('rpc_method', [])).rejects.toThrow('invalid');

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalledWith({result: true});

        expect(ipcProvider.listenerCount('0x0')).toEqual(0);
    });

    it('calls sendBatch and returns a resolved promise', async () => {
        const abstractMethodMock = new AbstractMethod();

        const moduleInstanceMock = new AbstractWeb3Module();

        abstractMethodMock.beforeExecution = jest.fn();
        abstractMethodMock.rpcMethod = 'rpc_method';
        abstractMethodMock.parameters = [];

        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        socketMock.pending = false;
        socketMock.writable = true;

        socketMock.write = jest.fn((jsonString) => {
            expect(jsonString).toEqual('[{"id":"0x0"}]');

            return true;
        });

        setTimeout(() => {
            ipcProvider.emit('0x0', {result: true});
        }, 1);

        const response = await ipcProvider.sendBatch([abstractMethodMock], moduleInstanceMock);

        expect(response).toEqual({result: true});

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);

        expect(ipcProvider.listenerCount('0x0')).toEqual(0);

        expect(abstractMethodMock.beforeExecution).toHaveBeenCalled();
    });

    it('calls sendPayload and returns a resolved promise', async () => {
        socketMock.pending = false;
        socketMock.writable = true;

        socketMock.write = jest.fn((jsonString) => {
            expect(jsonString).toEqual('{"id":"0x0"}');

            return true;
        });

        setTimeout(() => {
            ipcProvider.emit('0x0', {result: true});
        }, 1);

        const response = await ipcProvider.sendPayload({id: '0x0'});

        expect(response).toEqual({result: true});

        expect(ipcProvider.listenerCount('0x0')).toEqual(0);
    });

    it('calls sendPayload and returns a rejected promise because the socket is still pending', async () => {
        socketMock.pending = true;

        await expect(ipcProvider.sendPayload({id: '0x0'})).rejects.toBeInstanceOf(Error);
    });

    it('calls sendPayload, connect to the node and returns a resolved promise', async () => {
        socketMock.pending = false;
        socketMock.writable = false;
        socketMock.connect = jest.fn();

        socketMock.write = jest.fn((jsonString) => {
            expect(jsonString).toEqual('{"id":"0x0"}');

            return true;
        });

        setTimeout(() => {
            ipcProvider.emit('0x0', {result: true});
        }, 1);

        const response = await ipcProvider.sendPayload({id: '0x0'});

        expect(response).toEqual({result: true});

        expect(ipcProvider.listenerCount('0x0')).toEqual(0);

        expect(socketMock.connect).toHaveBeenCalledWith({path: ipcProvider.path});
    });

    it('calls sendPayload and returns a rejected promise because the write method returns false', async () => {
        socketMock.pending = false;
        socketMock.writable = true;

        socketMock.write = jest.fn((jsonString) => {
            expect(jsonString).toEqual('{"id":"0x0"}');

            return false;
        });

        setTimeout(() => {
            ipcProvider.emit('0x0', {result: true});
        }, 1);

        await expect(ipcProvider.sendPayload({id: '0x0'})).rejects.toThrow(
            "Connection error: Couldn't write on the socket with Socket.write(payload)"
        );
    });

    it('calls sendPayload with a batch payload and returns a resolved promise', async () => {
        socketMock.pending = false;
        socketMock.writable = true;

        socketMock.write = jest.fn((jsonString) => {
            expect(jsonString).toEqual('[{"id":"0x0"}]');

            return true;
        });

        setTimeout(() => {
            ipcProvider.emit('0x0', {result: true});
        }, 1);

        const response = await ipcProvider.sendPayload([{id: '0x0'}]);

        expect(response).toEqual({result: true});

        expect(ipcProvider.listenerCount('0x0')).toEqual(0);
    });
});
