import IpcProvider from '../../../src/providers/IpcProvider';
import AbstractSocketProvider from '../../../lib/providers/AbstractSocketProvider';

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
        socketMock.on = jest.fn();
        socketMock.removeListener = jest.fn();

        ipcProvider = new IpcProvider(socketMock, 'PATH');
    });

    it('constructor check', () => {
        expect(ipcProvider).toBeInstanceOf(AbstractSocketProvider);

        expect(ipcProvider.connection).toEqual(socketMock);

        expect(ipcProvider.host).toEqual('PATH');

        expect(socketMock.on.mock.calls[0][0]).toEqual('data');
        expect(socketMock.on.mock.calls[0][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[1][0]).toEqual('connect');
        expect(socketMock.on.mock.calls[1][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[2][0]).toEqual('error');
        expect(socketMock.on.mock.calls[2][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[3][0]).toEqual('close');
        expect(socketMock.on.mock.calls[3][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[4][0]).toEqual('timeout');
        expect(socketMock.on.mock.calls[4][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[5][0]).toEqual('ready');
        expect(socketMock.on.mock.calls[5][1]).toBeInstanceOf(Function);
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

    it('calls onMessage with one chunk', (done) => {
        const objectWithToString = {
            toString: jest.fn(() => {
                return '{"id":"0x0"}';
            })
        };

        ipcProvider.on('0x0', (response) => {
            expect(response).toEqual({id: '0x0'});

            done();
        });

        ipcProvider.onMessage(objectWithToString);

        expect(objectWithToString.toString).toHaveBeenCalled();
    });

    it('calls onMessage with more than one chunk', (done) => {
        let callCount = 0;
        const firstChunk = {
            toString: jest.fn(() => {
                return '{"id":"0x0"}{"id":"0x0"}';
            })
        };
        const secondChunk = {
            toString: jest.fn(() => {
                return '{"id":"0x0"}{"id":"0x';
            })
        };
        const thirdChunk = {
            toString: jest.fn(() => {
                return '0"}';
            })
        };

        ipcProvider.on('0x0', (response) => {
            expect(response).toEqual({id: '0x0'});

            if (callCount === 1) {
                done();
            }

            callCount++;
        });

        ipcProvider.onMessage(firstChunk);
        ipcProvider.onMessage(secondChunk);
        ipcProvider.onMessage(thirdChunk);

        expect(firstChunk.toString).toHaveBeenCalledWith();
        expect(secondChunk.toString).toHaveBeenCalledWith();
        expect(thirdChunk.toString).toHaveBeenCalledWith();
    });

    it('calls registEventListener with a Socket object as connection', () => {
        socketMock = function Socket() {};
        socketMock.on = jest.fn();

        ipcProvider = new IpcProvider(socketMock, 'PATH');

        ipcProvider.registerEventListeners();

        expect(socketMock.on.mock.calls[0][0]).toEqual('data');
        expect(socketMock.on.mock.calls[0][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[1][0]).toEqual('connect');
        expect(socketMock.on.mock.calls[1][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[2][0]).toEqual('error');
        expect(socketMock.on.mock.calls[2][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[3][0]).toEqual('close');
        expect(socketMock.on.mock.calls[3][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[4][0]).toEqual('timeout');
        expect(socketMock.on.mock.calls[4][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[5][0]).toEqual('ready');
        expect(socketMock.on.mock.calls[5][1]).toBeInstanceOf(Function);
    });

    it('calls registerEventListener', () => {
        socketMock.on = jest.fn();

        ipcProvider.registerEventListeners();

        expect(socketMock.on.mock.calls[0][0]).toEqual('data');
        expect(socketMock.on.mock.calls[0][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[1][0]).toEqual('connect');
        expect(socketMock.on.mock.calls[1][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[2][0]).toEqual('error');
        expect(socketMock.on.mock.calls[2][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[3][0]).toEqual('close');
        expect(socketMock.on.mock.calls[3][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[4][0]).toEqual('timeout');
        expect(socketMock.on.mock.calls[4][1]).toBeInstanceOf(Function);

        expect(socketMock.on.mock.calls[5][0]).toEqual('ready');
        expect(socketMock.on.mock.calls[5][1]).toBeInstanceOf(Function);
    });

    it('calls removeAllListeners with the "socket_message" event', () => {
        socketMock.removeListener = jest.fn();

        ipcProvider.removeAllListeners('socket_message');

        expect(socketMock.removeListener).toHaveBeenCalledWith('data', ipcProvider.onMessage);
    });

    it('calls removeAllListeners with the "socket_ready" event', () => {
        socketMock.removeListener = jest.fn();

        ipcProvider.removeAllListeners('socket_ready');

        expect(socketMock.removeListener).toHaveBeenCalledWith('ready', ipcProvider.onReady);
    });

    it('calls removeAllListeners with the "socket_close" event', () => {
        socketMock.removeListener = jest.fn();

        ipcProvider.removeAllListeners('socket_close');

        expect(socketMock.removeListener).toHaveBeenCalledWith('close', ipcProvider.onClose);
    });

    it('calls removeAllListeners with the "socket_error" event', () => {
        socketMock.removeListener = jest.fn();

        ipcProvider.removeAllListeners('socket_error');

        expect(socketMock.removeListener).toHaveBeenCalledWith('error', ipcProvider.onError);
    });

    it('calls removeAllListeners with the "socket_connect" event', () => {
        socketMock.removeListener = jest.fn();

        ipcProvider.removeAllListeners('socket_connect');

        expect(socketMock.removeListener).toHaveBeenCalledWith('connect', ipcProvider.onConnect);
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

    it('calls sendPayload and returns a rejected promise because the underlying IPC socket connection emits an error', async () => {
        socketMock.pending = false;
        socketMock.writable = true;

        socketMock.write = jest.fn((jsonString) => {
            expect(jsonString).toEqual('{"id":"0x0"}');

            ipcProvider.emit('error', {error: true});
        });

        await expect(ipcProvider.sendPayload({id: '0x0'})).rejects.toEqual({error: true});
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
