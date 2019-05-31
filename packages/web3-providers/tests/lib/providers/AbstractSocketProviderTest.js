import AbstractSocketProvider from '../../../lib/providers/AbstractSocketProvider';
import {w3cwebsocket as W3CWebsocket} from 'websocket';
import EventEmitter from 'eventemitter3';
import JsonRpcMapper from '../../../src/mappers/JsonRpcMapper';
import JsonRpcResponseValidator from '../../../src/validators/JsonRpcResponseValidator';
import AbstractMethod from '../../__mocks__/AbstractMethod';
import AbstractWeb3Module from '../../__mocks__/AbstractWeb3Module';

// Mocks
jest.mock('websocket');

/**
 * AbstractSocketProvider test
 */
describe('AbstractSocketProviderTest', () => {
    let abstractSocketProvider, socketMock;

    beforeEach(() => {
        new W3CWebsocket();
        socketMock = W3CWebsocket.mock.instances[0];

        abstractSocketProvider = new AbstractSocketProvider(socketMock, 0);
    });

    it('constructor check', () => {
        abstractSocketProvider = new AbstractSocketProvider(socketMock, 0);

        expect(abstractSocketProvider.timeout).toEqual(0);

        expect(abstractSocketProvider.subscriptions).toEqual({});

        expect(abstractSocketProvider.connection).toEqual(socketMock);

        expect(abstractSocketProvider.READY).toEqual('ready');

        expect(abstractSocketProvider.CONNECT).toEqual('connect');

        expect(abstractSocketProvider.ERROR).toEqual('error');

        expect(abstractSocketProvider.CLOSE).toEqual('close');

        expect(abstractSocketProvider.SOCKET_MESSAGE).toEqual('socket_message');

        expect(abstractSocketProvider.SOCKET_READY).toEqual('socket_ready');

        expect(abstractSocketProvider.SOCKET_CLOSE).toEqual('socket_close');

        expect(abstractSocketProvider.SOCKET_ERROR).toEqual('socket_error');

        expect(abstractSocketProvider.SOCKET_CONNECT).toEqual('socket_connect');

        expect(abstractSocketProvider.disconnect).toBeInstanceOf(Function);

        expect(abstractSocketProvider.send).toBeInstanceOf(Function);

        expect(abstractSocketProvider.sendBatch).toBeInstanceOf(Function);

        expect(abstractSocketProvider.registerEventListeners).toBeInstanceOf(Function);

        expect(abstractSocketProvider).toBeInstanceOf(EventEmitter);
    });

    it('calls supportsSubscriptions and returns true', () => {
        expect(abstractSocketProvider.supportsSubscriptions()).toEqual(true);
    });

    it('calls removeAllListeners without event parameter', () => {
        abstractSocketProvider.on('test', () => {});

        abstractSocketProvider.removeAllListeners();

        expect(abstractSocketProvider.listenerCount('test')).toEqual(0);
    });

    it('calls removeAllListeners with a specific event', () => {
        abstractSocketProvider.on('testing', () => {});

        abstractSocketProvider.removeAllListeners('testing');

        expect(abstractSocketProvider.listenerCount('testing')).toEqual(0);
    });

    it('calls onReady and ready event will be emitted', (done) => {
        abstractSocketProvider.on('ready', (event) => {
            expect(event).toEqual('ready!');

            done();
        });

        abstractSocketProvider.onReady('ready!');
    });

    it('calls onError and error event will be emitted', (done) => {
        abstractSocketProvider.on('error', (error) => {
            expect(error).toEqual('not ready!');

            done();
        });

        abstractSocketProvider.removeAllListeners = jest.fn();

        abstractSocketProvider.onError('not ready!');
    });

    it('calls onClose and close event will be emitted', (done) => {
        abstractSocketProvider.on('close', (error) => {
            expect(error).toEqual('bye');

            done();
        });

        abstractSocketProvider.removeAllListeners = jest.fn();

        abstractSocketProvider.onClose('bye');

        expect(abstractSocketProvider.removeAllListeners).toHaveBeenCalled();
    });

    it('calls onConnect and connect event will be emitted', async () => {
        const callback = jest.fn();
        abstractSocketProvider.on('connect', callback);

        abstractSocketProvider.subscriptions['0x0'] = {
            id: '0x0',
            subscribeMethod: 'eth_subscribe',
            parameters: ['logs', {}]
        };

        abstractSocketProvider.send = jest.fn((subscribeMethod, parameters) => {
            expect(subscribeMethod).toEqual('eth_subscribe');

            expect(parameters).toEqual(['logs', {}]);

            return Promise.resolve('0x1');
        });

        await abstractSocketProvider.onConnect();

        expect(callback).toHaveBeenCalled();

        expect(abstractSocketProvider.subscriptions['0x0'].id).toEqual('0x1');

        expect(abstractSocketProvider.send).toHaveBeenCalled();
    });

    it('calls onMessage and the JSON-RPC message id will be used as event name', (done) => {
        abstractSocketProvider.on('MY_ID', (response) => {
            expect(response).toEqual({id: 'MY_ID'});

            done();
        });

        abstractSocketProvider.onMessage('{"id": "MY_ID"}');
    });

    it('calls onMessage with a response object and the JSON-RPC message id will be used as event name', (done) => {
        abstractSocketProvider.on('MY_ID', (response) => {
            expect(response).toEqual({id: 'MY_ID'});

            done();
        });

        abstractSocketProvider.onMessage({id: 'MY_ID'});
    });

    it('calls onMessage and the subscription id will be used as event name', (done) => {
        abstractSocketProvider.subscriptions['0x0'] = {subscription: '0x0'};

        abstractSocketProvider.on('0x0', (response) => {
            expect(response).toEqual({subscription: '0x0'});

            done();
        });

        abstractSocketProvider.onMessage('{"params": {"subscription": "0x0"}}');
    });

    it('calls onMessage and the id of the first batch response item will be used as event name', (done) => {
        abstractSocketProvider.on('MY_ID', (response) => {
            expect(response).toEqual([{id: 'MY_ID'}]);

            done();
        });

        abstractSocketProvider.onMessage('[{"id": "MY_ID"}]');
    });

    it('calls reset', () => {
        abstractSocketProvider.on('test', () => {});
        abstractSocketProvider.registerEventListeners = jest.fn();

        abstractSocketProvider.reset();

        expect(abstractSocketProvider.registerEventListeners).toHaveBeenCalled();

        expect(abstractSocketProvider.listenerCount('test')).toEqual(0);
    });

    it('calls subscribe and returns a resolved promise with a subscription ID', async () => {
        abstractSocketProvider.send = jest.fn((subscribeMethod, parameters) => {
            expect(subscribeMethod).toEqual('shh_subscribe');

            expect(parameters).toEqual(['messages']);

            return Promise.resolve('0x1');
        });

        const response = await abstractSocketProvider.subscribe('shh_subscribe', 'messages', []);

        expect(response).toEqual('0x1');

        expect(abstractSocketProvider.subscriptions['0x1'].id).toEqual('0x1');

        expect(abstractSocketProvider.send).toHaveBeenCalled();
    });

    it('calls subscribe and returns a rejected promise because of the provider', async () => {
        abstractSocketProvider.send = jest.fn((subscribeMethod, parameters) => {
            expect(subscribeMethod).toEqual('shh_subscribe');

            expect(parameters).toEqual(['messages']);

            return Promise.reject(new Error('NOPE'));
        });

        await expect(abstractSocketProvider.subscribe('shh_subscribe', 'messages', [])).rejects.toThrow('NOPE');

        expect(abstractSocketProvider.send).toHaveBeenCalled();
    });

    it('calls unsubscribe and subscription id does not exist', () => {
        expect(abstractSocketProvider.unsubscribe('no', 'eth_unsubscribe')).rejects.toThrow(
            'Provider error: Subscription with ID no does not exist.'
        );
    });

    it('calls unsubscribe and resolves to a promise', async () => {
        abstractSocketProvider.subscriptions['0x0'] = true;
        abstractSocketProvider.removeAllListeners = jest.fn();

        abstractSocketProvider.send = jest.fn((subscribeMethod, parameters) => {
            expect(subscribeMethod).toEqual('eth_unsubscribe');

            expect(parameters).toEqual(['0x0']);

            return Promise.resolve(true);
        });

        const reaponse = await abstractSocketProvider.unsubscribe('0x0', 'eth_unsubscribe');

        expect(reaponse).toEqual(true);

        expect(abstractSocketProvider.removeAllListeners).toHaveBeenCalledWith('0x0');

        expect(abstractSocketProvider.subscriptions['0x0']).toBeUndefined();
    });

    it('calls clearSubscriptions and one unsubscribe call returns false', async () => {
        abstractSocketProvider.subscriptions['0x0'] = {id: '0x0'};
        abstractSocketProvider.removeAllListeners = jest.fn();

        abstractSocketProvider.send = jest.fn((subscribeMethod, parameters) => {
            expect(subscribeMethod).toEqual('eth_unsubscribe');

            expect(parameters).toEqual(['0x0']);

            return Promise.resolve(false);
        });

        await expect(abstractSocketProvider.clearSubscriptions('eth_unsubscribe')).rejects.toThrow(
            `Could not unsubscribe all subscriptions: ${JSON.stringify([false])}`
        );

        expect(abstractSocketProvider.removeAllListeners).toHaveBeenCalledWith('0x0');
    });

    it('calls clearSubscriptions and all unsubscribe calls are returning true', async () => {
        abstractSocketProvider.subscriptions['0x0'] = {id: '0x0'};
        abstractSocketProvider.removeAllListeners = jest.fn();

        abstractSocketProvider.send = jest.fn((subscribeMethod, parameters) => {
            expect(subscribeMethod).toEqual('eth_unsubscribe');

            expect(parameters).toEqual(['0x0']);

            return Promise.resolve(true);
        });

        const response = await abstractSocketProvider.clearSubscriptions('eth_unsubscribe');

        expect(response).toEqual(true);

        expect(abstractSocketProvider.removeAllListeners).toHaveBeenCalledWith('0x0');

        expect(abstractSocketProvider.subscriptions).toEqual({});
    });

    it('calls getSubscriptionEvent and has to iterate over all items', () => {
        abstractSocketProvider.subscriptions['ID'] = {id: '0x0'};

        expect(abstractSocketProvider.getSubscriptionEvent('0x0')).toEqual('ID');
    });

    it('calls send and returns a resolved promise', async () => {
        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        JsonRpcResponseValidator.validate = jest.fn();
        JsonRpcResponseValidator.validate.mockReturnValueOnce(true);

        abstractSocketProvider.sendPayload = jest.fn();
        abstractSocketProvider.sendPayload.mockReturnValueOnce(Promise.resolve({result: true}));

        const response = await abstractSocketProvider.send('rpc_method', []);

        expect(response).toEqual(true);

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalledWith({result: true});

        expect(abstractSocketProvider.sendPayload).toHaveBeenCalledWith({id: '0x0'});
    });

    it('calls send and returns a rejected promise because of an invalid rpc response', async () => {
        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        JsonRpcResponseValidator.validate = jest.fn();
        JsonRpcResponseValidator.validate.mockReturnValueOnce(new Error('invalid'));

        abstractSocketProvider.sendPayload = jest.fn();
        abstractSocketProvider.sendPayload.mockReturnValueOnce(Promise.resolve({result: true}));

        await expect(abstractSocketProvider.send('rpc_method', [])).rejects.toThrow('invalid');

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalledWith({result: true});

        expect(abstractSocketProvider.sendPayload).toHaveBeenCalledWith({id: '0x0'});
    });

    it('calls sendBatch and returns a resolved promise', async () => {
        const abstractMethodMock = new AbstractMethod();

        const moduleInstanceMock = new AbstractWeb3Module();

        abstractMethodMock.beforeExecution = jest.fn();
        abstractMethodMock.rpcMethod = 'rpc_method';
        abstractMethodMock.parameters = [];

        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        abstractSocketProvider.sendPayload = jest.fn();
        abstractSocketProvider.sendPayload.mockReturnValueOnce(Promise.resolve({result: true}));

        const response = await abstractSocketProvider.sendBatch([abstractMethodMock], moduleInstanceMock);

        expect(response).toEqual({result: true});

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);

        expect(abstractMethodMock.beforeExecution).toHaveBeenCalled();

        expect(abstractSocketProvider.sendPayload).toHaveBeenCalledWith([{id: '0x0'}]);
    });
});
