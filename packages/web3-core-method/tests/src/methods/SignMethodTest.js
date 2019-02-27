import {formatters} from 'web3-core-helpers';
import {WebsocketProvider} from 'web3-providers';
import {AbstractWeb3Module} from 'web3-core';
import * as Utils from 'web3-utils';
import SignMethod from '../../../src/methods/SignMethod';
import Accounts from '../../__mocks__/Accounts';
import AbstractMethod from '../../../lib/methods/AbstractMethod';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('WebsocketProvider');
jest.mock('AbstractWeb3Module');

/**
 * SignMethod test
 */
describe('SignMethodTest', () => {
    let method, providerMock, moduleInstanceMock, accountsMock;

    beforeEach(() => {
        new WebsocketProvider({});
        providerMock = WebsocketProvider.mock.instances[0];
        providerMock.send = jest.fn();

        accountsMock = new Accounts();
        accountsMock.sign = jest.fn();
        accountsMock.wallet = {'0x0': {privateKey: '0x0', address: '0x0'}};
        accountsMock.accountsIndex = 1;

        new AbstractWeb3Module(providerMock, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];
        moduleInstanceMock.accounts = accountsMock;

        method = new SignMethod(Utils, formatters);
        method.callback = jest.fn();
        method.parameters = ['nope', '0x0'];
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.parametersAmount).toEqual(2);

        expect(method.rpcMethod).toEqual('eth_sign');
    });

    it('calls execute with wallets defined', async () => {
        formatters.inputSignFormatter.mockReturnValueOnce('string');

        formatters.inputAddressFormatter.mockReturnValueOnce('0x0');

        accountsMock.sign.mockReturnValueOnce('0x00');

        const response = await method.execute(moduleInstanceMock);

        expect(response).toEqual('0x00');

        expect(method.callback).toHaveBeenCalledWith(false, '0x00');

        expect(method.parameters[0]).toEqual('string');

        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputSignFormatter).toHaveBeenCalledWith('nope');

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('0x0');

        expect(accountsMock.sign).toHaveBeenCalledWith('string', '0x0');
    });

    it('calls execute with wallets defined but accounts.sign throws an error', async () => {
        formatters.inputSignFormatter.mockReturnValueOnce('string');

        formatters.inputAddressFormatter.mockReturnValueOnce('0x0');

        const error = new Error('SIGN ERROR');
        accountsMock.sign = jest.fn(() => {
            throw error;
        });

        try {
            await method.execute(moduleInstanceMock);
        } catch (error2) {
            expect(error2).toEqual(error);

            expect(method.callback).toHaveBeenCalledWith(error, null);

            expect(formatters.inputSignFormatter).toHaveBeenCalledWith('nope');

            expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('0x0');

            expect(accountsMock.sign).toHaveBeenCalledWith('string', '0x0');
        }
    });

    it('calls execute and the account does not exist in the eth-accounts wallet', async () => {
        accountsMock.wallet = {'nope': {privateKey: '0x0'}};

        formatters.inputSignFormatter.mockReturnValueOnce('string');

        formatters.inputAddressFormatter.mockReturnValueOnce('0x0');

        providerMock.send.mockReturnValueOnce(Promise.resolve('0x0'));

        moduleInstanceMock.currentProvider = providerMock;

        const response = await method.execute(moduleInstanceMock);

        expect(response).toEqual('0x0');

        expect(method.callback).toHaveBeenCalledWith(false, '0x0');

        expect(method.parameters[0]).toEqual('string');

        expect(method.parameters[1]).toEqual('0x0');

        expect(providerMock.send).toHaveBeenCalledWith('eth_sign', method.parameters);

        expect(formatters.inputSignFormatter).toHaveBeenCalledWith('nope');

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('0x0');
    });

    it('beforeExecution should call the inputSignFormatter and inputAddressFormatter', () => {
        method.parameters = ['string', 'string'];

        formatters.inputSignFormatter.mockReturnValueOnce('string');

        formatters.inputAddressFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution(moduleInstanceMock);

        expect(method.parameters[0]).toEqual('string');

        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputSignFormatter).toHaveBeenCalledWith('string');

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('string');
    });

    it('afterExecution should just return the response', () => {
        expect(method.afterExecution({})).toEqual({});
    });
});
