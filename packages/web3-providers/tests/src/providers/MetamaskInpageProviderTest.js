import AbstractMethod from '../../__mocks__/AbstractMethod';
import JsonRpcMapper from '../../../src/mappers/JsonRpcMapper';
import JsonRpcResponseValidator from '../../../src/validators/JsonRpcResponseValidator';
import AbstractWeb3Module from '../../__mocks__/AbstractWeb3Module';
import MetamaskInpageProvider from '../../../src/providers/MetamaskInpageProvider';

/**
 * MetamaskInpageProvider test
 */
describe('MetamaskInpageProviderTest', () => {
    let metamaskInpageProvider, inpageProvider;

    beforeEach(() => {
        inpageProvider = {on: jest.fn(), isConnected: jest.fn()};
        metamaskInpageProvider = new MetamaskInpageProvider(inpageProvider);
    });

    it('constructor check', () => {
        expect(metamaskInpageProvider.connection).toEqual(inpageProvider);

        expect(metamaskInpageProvider.host).toEqual('metamask');

        expect(metamaskInpageProvider.timeout).toEqual(null);
    });

    it('calls registerEventListeners and the expected listeners will be registered', () => {
        metamaskInpageProvider.registerEventListeners();

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
        expect(metamaskInpageProvider.disconnect()).toEqual(true);
    });

    it('calls connected and returns true', () => {
        inpageProvider.isConnected.mockReturnValueOnce(true);

        expect(metamaskInpageProvider.connected).toEqual(true);

        expect(inpageProvider.isConnected).toHaveBeenCalled();
    });

    it('calls removeAllListeners and executes the expected methods', () => {
        inpageProvider.removeListener = jest.fn();

        metamaskInpageProvider.removeAllListeners('socket_networkChanged');
        metamaskInpageProvider.removeAllListeners('socket_accountsChanged');
        metamaskInpageProvider.removeAllListeners('socket_message');
        metamaskInpageProvider.removeAllListeners('socket_error');

        expect(inpageProvider.removeListener).toHaveBeenNthCalledWith(
            1,
            'networkChanged',
            metamaskInpageProvider.onNetworkChanged
        );

        expect(inpageProvider.removeListener).toHaveBeenNthCalledWith(
            2,
            'accountsChanged',
            metamaskInpageProvider.onAccountsChanged
        );

        expect(inpageProvider.removeListener).toHaveBeenNthCalledWith(3, 'data', metamaskInpageProvider.onMessage);
        expect(inpageProvider.removeListener).toHaveBeenNthCalledWith(4, 'error', metamaskInpageProvider.onError);
    });

    it('calls removeAllSocketListeners and exectues the expected methods', () => {
        inpageProvider.removeListener = jest.fn();

        metamaskInpageProvider.removeAllSocketListeners();

        expect(inpageProvider.removeListener).toHaveBeenNthCalledWith(
            1,
            metamaskInpageProvider.SOCKET_NETWORK_CHANGED,
            metamaskInpageProvider.onNetworkChanged
        );

        expect(inpageProvider.removeListener).toHaveBeenNthCalledWith(
            2,
            metamaskInpageProvider.SOCKET_ACCOUNTS_CHANGED,
            metamaskInpageProvider.onAccountsChanged
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

        const response = await metamaskInpageProvider.send('rpc_method', []);

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

        await expect(metamaskInpageProvider.send('rpc_method', [])).rejects.toEqual(true);

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

        const response = await metamaskInpageProvider.sendBatch([abstractMethodMock], moduleInstanceMock);

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

        await expect(metamaskInpageProvider.sendBatch([abstractMethodMock], moduleInstanceMock)).rejects.toEqual(true);

        expect(inpageProvider.send).toHaveBeenCalled();

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);
    });

    it('calls sendPayload and returns with an resolved promise', async () => {
        inpageProvider.send = jest.fn((payload, callback) => {
            expect(callback).toBeInstanceOf(Function);

            expect(payload).toEqual({id: 0});

            callback(false, true);
        });

        const response = await metamaskInpageProvider.sendPayload({id: 0});

        expect(response).toEqual(true);

        expect(inpageProvider.send).toHaveBeenCalled();
    });

    it('calls sendPayload and returns with an rejected promise', async () => {
        inpageProvider.send = jest.fn((payload, callback) => {
            expect(callback).toBeInstanceOf(Function);

            expect(payload).toEqual({id: 0});

            callback(true, false);
        });

        await expect(metamaskInpageProvider.sendPayload({id: 0})).rejects.toEqual(true);

        expect(inpageProvider.send).toHaveBeenCalled();
    });
});
