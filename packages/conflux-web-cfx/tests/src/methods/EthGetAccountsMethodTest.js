import {AbstractWeb3Module} from 'conflux-web-core';
import {GetAccountsMethod} from 'conflux-web-core-method';
import EthGetAccountsMethod from '../../../src/methods/EthGetAccountsMethod';

// Mocks
jest.mock('conflux-web-core');

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
    });
});
