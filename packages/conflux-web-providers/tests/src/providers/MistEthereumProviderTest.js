import MistConfluxProvider from '../../../src/providers/MistConfluxProvider';

/**
 * MistConfluxProvider test
 */
describe('MistConfluxProviderTest', () => {
    let mistConfluxProvider, confluxProvider;

    beforeEach(() => {
        confluxProvider = {on: jest.fn(), isConnected: jest.fn()};
        mistConfluxProvider = new MistConfluxProvider(confluxProvider);
    });

    it('constructor check', () => {
        expect(mistConfluxProvider.connection).toEqual(confluxProvider);

        expect(mistConfluxProvider.host).toEqual('mist');

        expect(mistConfluxProvider.timeout).toEqual(null);
    });

    it('calls registerEventListeners and the expected listeners will be registered', () => {
        mistConfluxProvider.registerEventListeners();

        expect(confluxProvider.on.mock.calls[0][0]).toEqual('data');
        expect(confluxProvider.on.mock.calls[0][1]).toBeInstanceOf(Function);

        expect(confluxProvider.on.mock.calls[1][0]).toEqual('error');
        expect(confluxProvider.on.mock.calls[1][1]).toBeInstanceOf(Function);

        expect(confluxProvider.on.mock.calls[2][0]).toEqual('connect');
        expect(confluxProvider.on.mock.calls[2][1]).toBeInstanceOf(Function);

        expect(confluxProvider.on.mock.calls[3][0]).toEqual('connect');
        expect(confluxProvider.on.mock.calls[3][1]).toBeInstanceOf(Function);

        expect(confluxProvider.on.mock.calls[4][0]).toEqual('end');
        expect(confluxProvider.on.mock.calls[4][1]).toBeInstanceOf(Function);
    });
    it('calls disconnect and returns true', () => {
        expect(mistConfluxProvider.disconnect()).toEqual(true);
    });

    it('calls connected and returns true', () => {
        confluxProvider.isConnected.mockReturnValueOnce(true);

        expect(mistConfluxProvider.connected).toEqual(true);

        expect(confluxProvider.isConnected).toHaveBeenCalled();
    });

    it('calls removeAllListeners and executes the expected methods', () => {
        confluxProvider.removeListener = jest.fn();

        mistConfluxProvider.removeAllListeners('socket_message');
        mistConfluxProvider.removeAllListeners('socket_error');
        mistConfluxProvider.removeAllListeners('socket_connect');
        mistConfluxProvider.removeAllListeners('socket_ready');
        mistConfluxProvider.removeAllListeners('socket_close');

        expect(confluxProvider.removeListener).toHaveBeenNthCalledWith(1, 'data', mistConfluxProvider.onMessage);
        expect(confluxProvider.removeListener).toHaveBeenNthCalledWith(2, 'error', mistConfluxProvider.onError);
        expect(confluxProvider.removeListener).toHaveBeenNthCalledWith(3, 'connect', mistConfluxProvider.onConnect);
        expect(confluxProvider.removeListener).toHaveBeenNthCalledWith(4, 'connect', mistConfluxProvider.onConnect);
        expect(confluxProvider.removeListener).toHaveBeenNthCalledWith(5, 'end', mistConfluxProvider.onClose);
    });

    it('calls sendPayload and returns with an resolved promise', async () => {
        confluxProvider.send = jest.fn((payload, callback) => {
            expect(callback).toBeInstanceOf(Function);

            expect(payload).toEqual({id: 0});

            callback(false, true);
        });

        const response = await mistConfluxProvider.sendPayload({id: 0});

        expect(response).toEqual(true);

        expect(confluxProvider.send).toHaveBeenCalled();
    });

    it('calls sendPayload and returns with an rejected promise', async () => {
        confluxProvider.send = jest.fn((payload, callback) => {
            expect(callback).toBeInstanceOf(Function);

            expect(payload).toEqual({id: 0});

            callback(true, false);
        });

        await expect(mistConfluxProvider.sendPayload({id: 0})).rejects.toEqual(true);

        expect(confluxProvider.send).toHaveBeenCalled();
    });
});
