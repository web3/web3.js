import {formatters} from 'web3-core-helpers';
import {AbstractWeb3Module} from 'web3-core';
import {SignMethod} from 'web3-core-method';
import * as Utils from 'web3-utils';
import {Accounts} from 'web3-eth-accounts';
import EthSignMethod from '../../../src/methods/EthSignMethod';

// Mocks
jest.mock('Utils');
jest.mock('Accounts');
jest.mock('formatters');
jest.mock('AbstractWeb3Module');

/**
 * EthSignMethod test
 */
describe('EthSignMethodTest', () => {
    let method, moduleInstanceMock, accountsMock;

    beforeEach(() => {
        accountsMock = {};
        accountsMock.sign = jest.fn();
        accountsMock.wallet = {'0x0': {privateKey: '0x0', address: '0x0'}};
        accountsMock.accountsIndex = 1;

        new AbstractWeb3Module({}, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];
        moduleInstanceMock.accounts = accountsMock;

        formatters.inputAddressFormatter.mockReturnValue('0x0');
        formatters.inputSignFormatter.mockReturnValue('string');

        method = new EthSignMethod(Utils, formatters, moduleInstanceMock);
        method.callback = jest.fn();
        method.parameters = ['nope', '0x0'];
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(SignMethod);
    });

    it('calls execute with wallets defined', async () => {
        accountsMock.sign.mockReturnValueOnce('0x00');

        const response = await method.execute(moduleInstanceMock);

        expect(response).toEqual('0x00');

        expect(method.callback).toHaveBeenCalledWith(false, '0x00');

        expect(method.parameters[0]).toEqual('string');

        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('0x0');

        expect(formatters.inputSignFormatter).toHaveBeenCalledWith('nope');

        expect(accountsMock.sign).toHaveBeenCalledWith('string', '0x0');
    });

    it('calls execute with wallets defined but accounts.sign throws an error', async () => {
        const error = new Error('SIGN ERROR');
        accountsMock.sign = jest.fn(() => {
            throw error;
        });

        try {
            await method.execute(moduleInstanceMock);
        } catch (error2) {
            expect(error2).toEqual(error);

            expect(method.callback).toHaveBeenCalledWith(error, null);

            expect(accountsMock.sign).toHaveBeenCalledWith('string', '0x0');
        }
    });

    it('calls execute and the account does not exist in the eth-accounts wallet', async () => {
        accountsMock.wallet = {nope: {privateKey: '0x0'}};

        moduleInstanceMock.currentProvider = {send: jest.fn()};

        method.execute(moduleInstanceMock);

        expect(moduleInstanceMock.currentProvider.send).toHaveBeenCalledWith('eth_sign', method.parameters);
    });
});
