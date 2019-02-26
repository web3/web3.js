import AbstractMethod from '../../__mocks__/AbstractMethod';
import JsonRpcMapper from '../../../src/mappers/JsonRpcMapper';
import JsonRpcResponseValidator from '../../../src/validators/JsonRpcResponseValidator';
import AbstractWeb3Module from '../../__mocks__/AbstractWeb3Module';
import MetamaskProvider from '../../../src/providers/MetamaskProvider';

/**
 * MetamaskProvider test
 */
describe('MetamaskProviderTest', () => {
    let metamaskProvider, inpageProvider;

    beforeEach(() => {
        inpageProvider = {on: jest.fn(), isConnected: jest.fn()};
        metamaskProvider = new MetamaskProvider(inpageProvider);
    });

    it('constructor check', () => {
        expect(metamaskProvider.connection).toEqual(inpageProvider);

        expect(metamaskProvider.host).toEqual('metamask');

        expect(metamaskProvider.timeout).toEqual(null);
    });

    it('calls registerEventListeners and the expected listeners will be registered', () => {
        metamaskProvider.registerEventListeners();

        expect(inpageProvider.on.mock.calls[0][0]).toEqual('accountsChanged');
        expect(inpageProvider.on.mock.calls[0][1]).toBeInstanceOf(Function);

        expect(inpageProvider.on.mock.calls[1][0]).toEqual('networkChanged');
        expect(inpageProvider.on.mock.calls[1][1]).toBeInstanceOf(Function);

        expect(inpageProvider.on.mock.calls[2][0]).toEqual('networkChanged');
        expect(inpageProvider.on.mock.calls[2][1]).toBeInstanceOf(Function);

        expect(inpageProvider.on.mock.calls[3][0]).toEqual('data');
        expect(inpageProvider.on.mock.calls[3][1]).toBeInstanceOf(Function);

        expect(inpageProvider.on.mock.calls[4][0]).toEqual('error');
        expect(inpageProvider.on.mock.calls[4][1]).toBeInstanceOf(Function);
    });
    it('calls disconnect and returns true', () => {
        expect(metamaskProvider.disconnect()).toEqual(true);
    });

    it('calls connected and returns true', () => {
        inpageProvider.isConnected.mockReturnValueOnce(true);

        expect(metamaskProvider.connected).toEqual(true);

        expect(inpageProvider.isConnected).toHaveBeenCalled();
    });

    it('calls removeAllListeners and executes the expected methods', () => {
        inpageProvider.removeListener = jest.fn();

        metamaskProvider.removeAllListeners('socket_networkChanged');
        metamaskProvider.removeAllListeners('socket_accountsChanged');
        metamaskProvider.removeAllListeners('socket_message');
        metamaskProvider.removeAllListeners('socket_error');

        expect(inpageProvider.removeListener).toHaveBeenNthCalledWith(
            1,
            'networkChanged',
            metamaskProvider.onNetworkChanged
        );

        expect(inpageProvider.removeListener).toHaveBeenNthCalledWith(
            2,
            'accountsChanged',
            metamaskProvider.onAccountsChanged
        );

        expect(inpageProvider.removeListener).toHaveBeenNthCalledWith(3, 'data', metamaskProvider.onMessage);
        expect(inpageProvider.removeListener).toHaveBeenNthCalledWith(4, 'error', metamaskProvider.onError);
    });

    it('calls removeAllSocketListeners and exectues the expected methods', () => {
        inpageProvider.removeListener = jest.fn();

        metamaskProvider.removeAllSocketListeners();

        expect(inpageProvider.removeListener).toHaveBeenNthCalledWith(
            1,
            metamaskProvider.SOCKET_NETWORK_CHANGED,
            metamaskProvider.onNetworkChanged
        );

        expect(inpageProvider.removeListener).toHaveBeenNthCalledWith(
            2,
            metamaskProvider.SOCKET_ACCOUNTS_CHANGED,
            metamaskProvider.onAccountsChanged
        );
    });

    it('calls send and returns with an resolved promise', async () => {
        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        JsonRpcResponseValidator.validate = jest.fn();
        JsonRpcResponseValidator.validate.mockReturnValueOnce(true);

        inpageProvider.send = jest.fn((payload, callback) => {
            expect(callback).toBeInstanceOf(Function);

            expect(payload).toEqual({id: '0x0'});

            callback(false, {result: true});
        });

        const response = await metamaskProvider.send('rpc_method', []);

        expect(response).toEqual(true);

        expect(inpageProvider.send).toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalledWith({result: true});
    });

    it('calls send and returns with an rejected promise', async () => {
        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        inpageProvider.send = jest.fn((payload, callback) => {
            expect(callback).toBeInstanceOf(Function);

            expect(payload).toEqual({id: '0x0'});

            callback(true, {result: true});
        });

        await expect(metamaskProvider.send('rpc_method', [])).rejects.toEqual(true);

        expect(inpageProvider.send).toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);
    });

    it('calls sendBatch and returns with an resolved promise', async () => {
        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        JsonRpcResponseValidator.validate = jest.fn();
        JsonRpcResponseValidator.validate.mockReturnValueOnce(true);

        inpageProvider.send = jest.fn((payload, callback) => {
            expect(callback).toBeInstanceOf(Function);

            expect(payload).toEqual([{id: '0x0'}]);

            callback(false, {result: true});
        });

        const moduleInstanceMock = new AbstractWeb3Module();

        const abstractMethodMock = new AbstractMethod();
        abstractMethodMock.beforeExecution = jest.fn();
        abstractMethodMock.rpcMethod = 'rpc_method';
        abstractMethodMock.parameters = [];

        const response = await metamaskProvider.sendBatch([abstractMethodMock], moduleInstanceMock);

        expect(response).toEqual({result: true});

        expect(inpageProvider.send).toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);
    });

    it('calls sendBatch and returns with an rejected promise', async () => {
        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        JsonRpcResponseValidator.validate = jest.fn();
        JsonRpcResponseValidator.validate.mockReturnValueOnce(true);

        inpageProvider.send = jest.fn((payload, callback) => {
            expect(callback).toBeInstanceOf(Function);

            expect(payload).toEqual([{id: '0x0'}]);

            callback(true, {result: true});
        });

        const moduleInstanceMock = new AbstractWeb3Module();

        const abstractMethodMock = new AbstractMethod();
        abstractMethodMock.beforeExecution = jest.fn();
        abstractMethodMock.rpcMethod = 'rpc_method';
        abstractMethodMock.parameters = [];

        await expect(metamaskProvider.sendBatch([abstractMethodMock], moduleInstanceMock)).rejects.toEqual(true);

        expect(inpageProvider.send).toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);
    });

    it('calls sendPayload and returns with an resolved promise', async () => {
        inpageProvider.send = jest.fn((payload, callback) => {
            expect(callback).toBeInstanceOf(Function);

            expect(payload).toEqual({id: 0});

            callback(false, true);
        });

        const response = await metamaskProvider.sendPayload({id: 0});

        expect(response).toEqual(true);

        expect(inpageProvider.send).toHaveBeenCalled();
    });

    it('calls sendPayload and returns with an rejected promise', async () => {
        inpageProvider.send = jest.fn((payload, callback) => {
            expect(callback).toBeInstanceOf(Function);

            expect(payload).toEqual({id: 0});

            callback(true, false);
        });

        await expect(metamaskProvider.sendPayload({id: 0})).rejects.toEqual(true);

        expect(inpageProvider.send).toHaveBeenCalled();
    });
});
