import {WebsocketProvider} from 'web3-providers';
import {AbstractWeb3Module} from 'web3-core';
import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import AbstractCallMethod from '../../../lib/methods/AbstractCallMethod';

// Mocks
jest.mock('WebsocketProvider');
jest.mock('AbstractWeb3Module');
jest.mock('Utils');
jest.mock('formatters');

/**
 * CallMethodCommand test
 */
describe('AbstractCallMethodTest', () => {
    let abstractCallMethod, providerMock, moduleInstanceMock;

    beforeEach(() => {
        new WebsocketProvider('host', {});
        providerMock = WebsocketProvider.mock.instances[0];
        providerMock.send = jest.fn();

        new AbstractWeb3Module(providerMock, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];

        abstractCallMethod = new AbstractCallMethod('RPC_METHOD', 0, Utils, formatters);
        abstractCallMethod.callback = jest.fn();
        abstractCallMethod.beforeExecution = jest.fn();
    });

    it('constructor check', () => {
        expect(AbstractCallMethod.Type).toEqual('CALL');

        expect(abstractCallMethod.rpcMethod).toEqual('RPC_METHOD');

        expect(abstractCallMethod.parametersAmount).toEqual(0);

        expect(abstractCallMethod.utils).toEqual(Utils);

        expect(abstractCallMethod.formatters).toEqual(formatters);
    });

    it('calls execute and returns with the expected value', async () => {
        abstractCallMethod.afterExecution = jest.fn(() => {
            return '0x00';
        });

        providerMock.send.mockReturnValueOnce(Promise.resolve('0x0'));

        moduleInstanceMock.currentProvider = providerMock;

        const response = await abstractCallMethod.execute(moduleInstanceMock);

        expect(response).toEqual('0x00');

        expect(providerMock.send).toHaveBeenCalledWith(abstractCallMethod.rpcMethod, abstractCallMethod.parameters);

        expect(abstractCallMethod.callback).toHaveBeenCalledWith(false, '0x00');

        expect(abstractCallMethod.beforeExecution).toHaveBeenCalledWith(moduleInstanceMock);

        expect(abstractCallMethod.afterExecution).toHaveBeenCalledWith('0x0');
    });

    it('calls execute and throws an error on sending the request to the connected node', async () => {
        const error = new Error('ERROR ON SEND');
        providerMock.send = jest.fn(() => {
            return Promise.reject(error);
        });

        moduleInstanceMock.currentProvider = providerMock;

        try {
            await abstractCallMethod.execute(moduleInstanceMock);
        } catch (error2) {
            expect(error2).toEqual(error);

            expect(providerMock.send).toHaveBeenCalledWith(abstractCallMethod.rpcMethod, abstractCallMethod.parameters);

            expect(abstractCallMethod.callback).toHaveBeenCalledWith(error, null);

            expect(abstractCallMethod.beforeExecution).toHaveBeenCalledWith(moduleInstanceMock);
        }
    });
});
