import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import Accounts from '../../../src/Accounts';
import AccountsModuleFactory from '../../../src/factories/AccountsModuleFactory';
import MethodFactory from '../../../src/factories/MethodFactory';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('../../../src/Accounts');

/**
 * AccountsModuleFactory test
 */
describe('AccountsModuleFactoryTest', () => {
    let accountsModuleFactory;

    beforeEach(() => {
        accountsModuleFactory = new AccountsModuleFactory(Utils, formatters);
    });

    it('constructor check', () => {
        expect(accountsModuleFactory.utils).toEqual(Utils);

        expect(accountsModuleFactory.formatters).toEqual(formatters);
    });

    it('calls createAccounts and returns a object of type Accounts', () => {
        expect(accountsModuleFactory.createAccounts({}, {}, {}, {})).toBeInstanceOf(Accounts);
    });

    it('calls createMethodFactory and returns a object of type MethodFactory', () => {
        expect(accountsModuleFactory.createMethodFactory({})).toBeInstanceOf(MethodFactory);
    });
});
