import {AbstractWeb3Module} from 'web3-core';
import {GetAccountsMethod} from 'web3-core-method';
import EthGetAccountsMethod from '../../../src/methods/EthGetAccountsMethod';

// Mocks
jest.mock('web3-core');

/**
 * EthGetAccountsMethod test
 */
describe('EthGetAccountsMethodTest', () => {
    let method, moduleInstanceMock, accountsMock;

    beforeEach(() => {
        accountsMock = {};
        accountsMock.wallet = {0: {privateKey: '0x0', address: '0x0'}, accountsIndex: 1};

        new AbstractWeb3Module({}, {}, {}, {});
        moduleInstanceMock = {};
        moduleInstanceMock.accounts = accountsMock;

        method = new EthGetAccountsMethod({}, {}, moduleInstanceMock);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(GetAccountsMethod);
    });

    it('calls execute with unlocked accounts', async () => {
        const response = await method.execute();

        expect(response).toEqual(['0x0']);

        method.execute();
    });

    it('calls execute if account is not unlocked', async () => {
        accountsMock.wallet = {0: {privateKey: '0x0', address: '0x0'}};

        method.execute();
    });
});
