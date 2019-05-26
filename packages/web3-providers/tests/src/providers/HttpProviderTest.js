import http from 'http';
import https from 'https';
import HttpProvider from '../../../src/providers/HttpProvider';
import ProvidersModuleFactory from '../../../src/factories/ProvidersModuleFactory';
import JsonRpcMapper from '../../../src/mappers/JsonRpcMapper';
import JsonRpcResponseValidator from '../../../src/validators/JsonRpcResponseValidator';
import AbstractWeb3Module from '../../__mocks__/AbstractWeb3Module';
import AbstractMethod from '../../__mocks__/AbstractMethod';
import {XMLHttpRequest as XHR} from 'xhr2-cookies';
import NetworkError from '../../__mocks__/NetworkError';

// Mocks
jest.mock('../../../src/factories/ProvidersModuleFactory');
jest.mock('http');
jest.mock('https');
jest.mock('xhr2-cookies');

/**
 * HttpProvider test
 */
describe('HttpProviderTest', () => {
    let httpProvider, providersModuleFactoryMock;

    beforeEach(() => {
        new ProvidersModuleFactory();
        providersModuleFactoryMock = ProvidersModuleFactory.mock.instances[0];

        httpProvider = new HttpProvider(
            'https',
            {headers: [], timeout: 1, keepAlive: true, withCredentials: true},
            providersModuleFactoryMock
        );
    });

    it('constructor check with https', () => {
        expect(httpProvider.host).toEqual('https');

        expect(httpProvider.headers).toEqual([]);

        expect(httpProvider.timeout).toEqual(1);

        expect(httpProvider.connected).toEqual(true);

        expect(httpProvider.providersModuleFactory).toEqual(providersModuleFactoryMock);

        expect(httpProvider.agent.httpsAgent).toBeInstanceOf(https.Agent);
    });

    it('constructor check with http', () => {
        httpProvider = new HttpProvider(
            'http',
            {headers: [], timeout: 1, keepAlive: true, withCredentials: true},
            providersModuleFactoryMock
        );

        expect(httpProvider.host).toEqual('http');

        expect(httpProvider.headers).toEqual([]);

        expect(httpProvider.timeout).toEqual(1);

        expect(httpProvider.connected).toEqual(true);

        expect(httpProvider.withCredentials).toEqual(true);

        expect(httpProvider.providersModuleFactory).toEqual(providersModuleFactoryMock);

        expect(httpProvider.agent.httpAgent).toBeInstanceOf(http.Agent);
    });

    it('constructor check without the property withCredentials in the options', () => {
        httpProvider = new HttpProvider('http', {headers: [], timeout: 1}, providersModuleFactoryMock);

        expect(httpProvider.host).toEqual('http');

        expect(httpProvider.headers).toEqual([]);

        expect(httpProvider.timeout).toEqual(1);

        expect(httpProvider.connected).toEqual(true);

        expect(httpProvider.withCredentials).toEqual(false);

        expect(httpProvider.providersModuleFactory).toEqual(providersModuleFactoryMock);

        expect(httpProvider.agent.httpAgent).toBeInstanceOf(http.Agent);
    });

    it('calls supportsSubscriptions and returns false', () => {
        expect(httpProvider.supportsSubscriptions()).toEqual(false);
    });

    it('calls subscribe and throws error', () => {
        expect(() => {
            httpProvider.subscribe();
        }).toThrow('Subscriptions are not supported with the HttpProvider.');
    });

    it('calls unsubscribe and throws error', () => {
        expect(() => {
            httpProvider.unsubscribe();
        }).toThrow('Subscriptions are not supported with the HttpProvider.');
    });

    it('calls disconnect and returns true', () => {
        expect(httpProvider.disconnect()).toEqual(true);
    });

    it('calls send and returns with a resolved promise', async () => {
        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        JsonRpcResponseValidator.validate = jest.fn();
        JsonRpcResponseValidator.validate.mockReturnValueOnce(true);

        new XHR();
        const xhrMock = XHR.mock.instances[0];

        xhrMock.readyState = 4;
        xhrMock.status = 200;
        xhrMock.responseText = '{"result":true}';

        providersModuleFactoryMock.createXMLHttpRequest.mockReturnValueOnce(xhrMock);

        setTimeout(() => {
            xhrMock.onreadystatechange();
        }, 1);

        const response = await httpProvider.send('rpc_method', []);

        expect(response).toEqual(true);

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalledWith({result: true});

        expect(providersModuleFactoryMock.createXMLHttpRequest).toHaveBeenCalledWith(
            httpProvider.host,
            httpProvider.timeout,
            httpProvider.headers,
            httpProvider.agent,
            httpProvider.withCredentials
        );

        expect(xhrMock.send).toHaveBeenCalledWith('{"id":"0x0"}');

        expect(httpProvider.connected).toEqual(true);
    });

    it('calls send and returns with a rejected promise because of an invalid JSON-RPC response', async () => {
        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        JsonRpcResponseValidator.validate = jest.fn();
        JsonRpcResponseValidator.validate.mockReturnValueOnce(new Error('invalid'));

        new XHR();
        const xhrMock = XHR.mock.instances[0];

        xhrMock.readyState = 4;
        xhrMock.status = 200;
        xhrMock.responseText = 'true';

        providersModuleFactoryMock.createXMLHttpRequest.mockReturnValueOnce(xhrMock);

        setTimeout(() => {
            xhrMock.onreadystatechange();
        }, 1);

        await expect(httpProvider.send('rpc_method', [])).rejects.toThrow('invalid');

        expect(JsonRpcResponseValidator.validate).toHaveBeenCalledWith(true);

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);

        expect(providersModuleFactoryMock.createXMLHttpRequest).toHaveBeenCalledWith(
            httpProvider.host,
            httpProvider.timeout,
            httpProvider.headers,
            httpProvider.agent,
            httpProvider.withCredentials
        );

        expect(xhrMock.send).toHaveBeenCalledWith('{"id":"0x0"}');
    });

    it('calls sendBatch and returns with a resolved promise', async () => {
        const abstractMethodMock = new AbstractMethod();

        const moduleInstanceMock = new AbstractWeb3Module();

        abstractMethodMock.beforeExecution = jest.fn();
        abstractMethodMock.rpcMethod = 'rpc_method';
        abstractMethodMock.parameters = [];

        JsonRpcMapper.toPayload = jest.fn();
        JsonRpcMapper.toPayload.mockReturnValueOnce({id: '0x0'});

        new XHR();
        const xhrMock = XHR.mock.instances[0];

        xhrMock.readyState = 4;
        xhrMock.status = 200;
        xhrMock.responseText = 'true';

        providersModuleFactoryMock.createXMLHttpRequest.mockReturnValueOnce(xhrMock);

        setTimeout(() => {
            xhrMock.onreadystatechange();
        }, 1);

        const response = await httpProvider.sendBatch([abstractMethodMock], moduleInstanceMock);

        expect(response).toEqual(true);

        expect(JsonRpcMapper.toPayload).toHaveBeenCalledWith('rpc_method', []);

        expect(providersModuleFactoryMock.createXMLHttpRequest).toHaveBeenCalledWith(
            httpProvider.host,
            httpProvider.timeout,
            httpProvider.headers,
            httpProvider.agent,
            httpProvider.withCredentials
        );

        expect(xhrMock.send).toHaveBeenCalledWith('[{"id":"0x0"}]');

        expect(abstractMethodMock.beforeExecution).toHaveBeenCalled();

        expect(httpProvider.connected).toEqual(true);
    });

    it('calls sendPayload and returns with a rejected promise because of an invalid JSON response', async () => {
        new XHR();
        const xhrMock = XHR.mock.instances[0];

        xhrMock.readyState = 4;
        xhrMock.status = 200;
        xhrMock.responseText = '{,}';

        providersModuleFactoryMock.createXMLHttpRequest.mockReturnValueOnce(xhrMock);

        setTimeout(() => {
            xhrMock.onreadystatechange();
        }, 1);

        await expect(httpProvider.sendPayload({id: '0x0'})).rejects.toThrow('Invalid JSON as response: {,}');

        expect(providersModuleFactoryMock.createXMLHttpRequest).toHaveBeenCalledWith(
            httpProvider.host,
            httpProvider.timeout,
            httpProvider.headers,
            httpProvider.agent,
            httpProvider.withCredentials
        );

        expect(xhrMock.send).toHaveBeenCalledWith('{"id":"0x0"}');
    });

    it('calls sendPayload and returns with a rejected promise because of an not existing http endpoint', async () => {
        new XHR();
        const xhrMock = XHR.mock.instances[0];

        xhrMock.readyState = 4;
        xhrMock.status = 0;
        xhrMock.response = null;

        providersModuleFactoryMock.createXMLHttpRequest.mockReturnValueOnce(xhrMock);

        setTimeout(() => {
            xhrMock.onreadystatechange();
        }, 1);

        await expect(httpProvider.sendPayload({id: '0x0'})).rejects.toThrow(
            `Connection refused or URL couldn't be resolved: ${httpProvider.host}`
        );

        expect(providersModuleFactoryMock.createXMLHttpRequest).toHaveBeenCalledWith(
            httpProvider.host,
            httpProvider.timeout,
            httpProvider.headers,
            httpProvider.agent,
            httpProvider.withCredentials
        );

        expect(xhrMock.send).toHaveBeenCalledWith('{"id":"0x0"}');
    });

    it('calls sendPayload and returns with a rejected promise because of the exceeded timeout', async () => {
        new XHR();
        const xhrMock = XHR.mock.instances[0];

        providersModuleFactoryMock.createXMLHttpRequest.mockReturnValueOnce(xhrMock);

        setTimeout(() => {
            xhrMock.ontimeout();
        }, 1);

        await expect(httpProvider.sendPayload({id: '0x0'})).rejects.toThrow(
            'Connection error: Timeout exceeded after 1ms'
        );

        expect(httpProvider.connected).toEqual(false);

        expect(providersModuleFactoryMock.createXMLHttpRequest).toHaveBeenCalledWith(
            httpProvider.host,
            httpProvider.timeout,
            httpProvider.headers,
            httpProvider.agent,
            httpProvider.withCredentials
        );

        expect(xhrMock.send).toHaveBeenCalledWith('{"id":"0x0"}');
    });

    it('calls sendPayload and returns with a rejected promise because the request status is between 400 and 499', async () => {
        new XHR();
        const xhrMock = XHR.mock.instances[0];

        xhrMock.readyState = 4;
        xhrMock.status = 450;
        xhrMock.responseText = 'NOPE';

        providersModuleFactoryMock.createXMLHttpRequest.mockReturnValueOnce(xhrMock);

        setTimeout(() => {
            xhrMock.onreadystatechange();
        }, 1);

        await expect(httpProvider.sendPayload({id: '0x0'})).rejects.toThrow('HttpProvider ERROR: NOPE (code: 450)');

        expect(providersModuleFactoryMock.createXMLHttpRequest).toHaveBeenCalledWith(
            httpProvider.host,
            httpProvider.timeout,
            httpProvider.headers,
            httpProvider.agent,
            httpProvider.withCredentials
        );

        expect(xhrMock.send).toHaveBeenCalledWith('{"id":"0x0"}');
    });

    it('calls sendPayload and returns with a rejected promise because the request.send() method throws an error', async () => {
        new XHR();
        const xhrMock = XHR.mock.instances[0];

        xhrMock.send = jest.fn(() => {
            throw new NetworkError('ERROR');
        });

        providersModuleFactoryMock.createXMLHttpRequest.mockReturnValueOnce(xhrMock);

        await expect(httpProvider.sendPayload({id: '0x0'})).rejects.toThrow('ERROR');

        expect(httpProvider.connected).toEqual(false);

        expect(providersModuleFactoryMock.createXMLHttpRequest).toHaveBeenCalledWith(
            httpProvider.host,
            httpProvider.timeout,
            httpProvider.headers,
            httpProvider.agent,
            httpProvider.withCredentials
        );

        expect(xhrMock.send).toHaveBeenCalledWith('{"id":"0x0"}');
    });
});
