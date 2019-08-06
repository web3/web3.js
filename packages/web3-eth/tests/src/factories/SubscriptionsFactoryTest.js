import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {
    LogSubscription,
    NewHeadsSubscription,
    NewPendingTransactionsSubscription,
    SyncingSubscription,
    AccountsChangedSubscription,
    NetworkChangedSubscription,
    ChainChangedSubscription
} from 'web3-core-subscriptions';

import SubscriptionsFactory from '../../../src/factories/SubscriptionsFactory';

// Mocks
jest.mock('web3-utils');
jest.mock('web3-core-helpers');
jest.mock('web3-core-subscriptions');

/**
 * SubscriptionsFactory test
 */
describe('SubscriptionsFactoryTest', () => {
    let subscriptionsFactory;

    beforeEach(() => {
        subscriptionsFactory = new SubscriptionsFactory(Utils, formatters);
    });

    it('constructor check', () => {
        expect(subscriptionsFactory.utils).toEqual(Utils);

        expect(subscriptionsFactory.formatters).toEqual(formatters);
    });

    it('calls getSubscription with "logs" and returns the LogsSubscription', () => {
        expect(subscriptionsFactory.getSubscription({}, 'logs', {})).toBeInstanceOf(LogSubscription);
    });

    it('calls getSubscription with "newBlockHeaders" and returns the LogsSubscription', () => {
        expect(subscriptionsFactory.getSubscription({}, 'newBlockHeaders', {})).toBeInstanceOf(NewHeadsSubscription);
    });

    it('calls getSubscription with "pendingTransactions" and returns the LogsSubscription', () => {
        expect(subscriptionsFactory.getSubscription({}, 'pendingTransactions', {})).toBeInstanceOf(
            NewPendingTransactionsSubscription
        );
    });

    it('calls getSubscription with "syncing" and returns the LogsSubscription', () => {
        expect(subscriptionsFactory.getSubscription({}, 'syncing', {})).toBeInstanceOf(SyncingSubscription);
    });

    it('calls getSubscription with "accountsChanged" and returns the AccountsChangedSubscription', () => {
        expect(subscriptionsFactory.getSubscription({}, 'accountsChanged', {})).toBeInstanceOf(
            AccountsChangedSubscription
        );
    });

    it('calls getSubscription with "chainChanged" and returns the ChainChangedSubscription', () => {
        expect(subscriptionsFactory.getSubscription({}, 'chainChanged', {})).toBeInstanceOf(ChainChangedSubscription);
    });

    it('calls getSubscription with "networkChanged" and returns the NetworkChangedSubscription', () => {
        expect(subscriptionsFactory.getSubscription({}, 'networkChanged', {})).toBeInstanceOf(
            NetworkChangedSubscription
        );
    });

    it('calls getSubscription and throws an error', () => {
        expect(() => {
            subscriptionsFactory.getSubscription({}, 'blub', {});
        }).toThrow('Unknown subscription: blub');
    });
});
