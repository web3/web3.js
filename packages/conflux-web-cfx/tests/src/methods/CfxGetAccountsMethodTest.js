import {AbstractConfluxWebModule} from 'conflux-web-core';
import {GetAccountsMethod} from 'conflux-web-core-method';
import CfxGetAccountsMethod from '../../../src/methods/CfxGetAccountsMethod';

// Mocks
jest.mock('conflux-web-core');

/**
 * CfxGetAccountsMethod test
 */
describe('CfxGetAccountsMethodTest', () => {
    let method, moduleInstanceMock, accountsMock;

    beforeEach(() => {
        accountsMock = {};
        accountsMock.wallet = {0: {privateKey: '0x0', address: '0x0'}, accountsIndex: 1};

        new AbstractConfluxWebModule({}, {}, {}, {});
        moduleInstanceMock = {};
        moduleInstanceMock.accounts = accountsMock;

        method = new CfxGetAccountsMethod({}, {}, moduleInstanceMock);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(GetAccountsMethod);
    });

    it('calls execute with unlocked accounts', async () => {
        const response = await method.execute();

        expect(response).toEqual(['0x0']);
    });
});
