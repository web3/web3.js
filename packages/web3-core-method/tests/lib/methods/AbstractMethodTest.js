import * as Utils from 'web3-utils';
import {WebsocketProvider} from 'web3-providers';
import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../lib/methods/AbstractMethod';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('WebsocketProvider');

/**
 * AbstractMethod test
 */
describe('AbstractMethodTest', () => {
    let abstractMethod, moduleInstanceMock, providerMock, callback;

    beforeEach(() => {
        callback = jest.fn();

        new WebsocketProvider('host', {});
        providerMock = WebsocketProvider.mock.instances[0];
        providerMock.send = jest.fn();

        moduleInstanceMock = {};

        abstractMethod = new AbstractMethod('RPC_TEST', 0, Utils, formatters, moduleInstanceMock);
        abstractMethod.callback = callback;
        abstractMethod.beforeExecution = jest.fn();
    });

    it('constructor check', () => {
        expect(abstractMethod.rpcMethod).toEqual('RPC_TEST');

        expect(abstractMethod.parametersAmount).toEqual(0);

        expect(abstractMethod.utils).toEqual(Utils);

        expect(abstractMethod.formatters).toEqual(formatters);

        expect(abstractMethod.moduleInstance).toEqual(moduleInstanceMock);

        expect(abstractMethod.parameters).toEqual([]);

        expect(abstractMethod.callback).toEqual(callback);
    });

    it('set arguments throws error on missing arguments', () => {
        abstractMethod.parametersAmount = 3;

        try {
            abstractMethod.arguments = [];
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    it('set arguments throws error if callback is not of type Function', () => {
        abstractMethod.parametersAmount = 1;

        try {
            abstractMethod.arguments = [true, true];
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    it('set arguments without callback', () => {
        abstractMethod.parametersAmount = 1;
        abstractMethod.arguments = [true];

        expect(abstractMethod.parameters).toEqual([true]);

        expect(abstractMethod.callback).toEqual(null);
    });

    it('set arguments with callback', () => {
        abstractMethod.parametersAmount = 1;
        abstractMethod.arguments = [true, () => {
        }];

        expect(abstractMethod.parameters).toEqual([true]);

        expect(abstractMethod.callback).toBeInstanceOf(Function);
    });

    it('get arguments', () => {
        abstractMethod.parametersAmount = 1;
        abstractMethod.arguments = [true];

        expect(abstractMethod.arguments).toEqual({callback: null, parameters: [true]});
    });

    it('set rpcMethod', () => {
        abstractMethod.rpcMethod = 'test';

        expect(abstractMethod.rpcMethod).toEqual('test');
    });

    it('set parameters', () => {
        abstractMethod.parameters = ['test'];

        expect(abstractMethod.parameters).toEqual(['test']);
    });

    it('set callback', () => {
        abstractMethod.callback = () => {
        };

        expect(abstractMethod.callback).toBeInstanceOf(Function);
    });

    it('check if execute method exists', () => {
        expect(abstractMethod.execute).toBeInstanceOf(Function);
    });

    it('afterExecution just returns the value', () => {
        expect(abstractMethod.afterExecution('string')).toEqual('string');
    });

    it('isHash returns true', () => {
        expect(abstractMethod.isHash('0x0')).toBeTruthy();
    });

    it('isHash returns false', () => {
        expect(abstractMethod.isHash(100)).toBeFalsy();
    });

    it('calls execute and returns with the expected value', async () => {
        abstractMethod.afterExecution = jest.fn(() => {
            return '0x00';
        });

        providerMock.send.mockReturnValueOnce(Promise.resolve('0x0'));

        moduleInstanceMock.currentProvider = providerMock;

        const response = await abstractMethod.execute(moduleInstanceMock);

        expect(response).toEqual('0x00');

        expect(providerMock.send).toHaveBeenCalledWith(abstractMethod.rpcMethod, abstractMethod.parameters);

        expect(abstractMethod.callback).toHaveBeenCalledWith(false, '0x00');

        expect(abstractMethod.beforeExecution).toHaveBeenCalledWith(moduleInstanceMock);

        expect(abstractMethod.afterExecution).toHaveBeenCalledWith('0x0');
    });

    it('calls execute and throws an error on sending the request to the connected node', async () => {
        providerMock.send = jest.fn(() => {
            return Promise.reject(new Error('ERROR ON SEND'));
        });

        moduleInstanceMock.currentProvider = providerMock;
        await expect(abstractMethod.execute(moduleInstanceMock)).rejects.toThrow('ERROR ON SEND');

        expect(providerMock.send).toHaveBeenCalledWith(abstractMethod.rpcMethod, abstractMethod.parameters);

        expect(abstractMethod.callback).toHaveBeenCalledWith(new Error('ERROR ON SEND'), null);

        expect(abstractMethod.beforeExecution).toHaveBeenCalledWith(moduleInstanceMock);
    });

    it('calls execute and throws an error because of a invalid parameters length', async () => {
        abstractMethod.parametersAmount = 0;
        abstractMethod.parameters = [true];

        await expect(abstractMethod.execute(moduleInstanceMock)).rejects
            .toThrow(`Invalid Arguments length: expected: 0, given: 1`);

        expect(abstractMethod.beforeExecution).toHaveBeenCalledWith(moduleInstanceMock);
    });

    it('calls execute and it returns null', async () => {
        providerMock.send.mockReturnValueOnce(Promise.resolve(null));

        moduleInstanceMock.currentProvider = providerMock;

        const response = await abstractMethod.execute(moduleInstanceMock);

        expect(response).toEqual(null);

        expect(providerMock.send).toHaveBeenCalledWith(abstractMethod.rpcMethod, abstractMethod.parameters);

        expect(abstractMethod.callback).toHaveBeenCalledWith(false, null);

        expect(abstractMethod.beforeExecution).toHaveBeenCalledWith(moduleInstanceMock);
    });
});
