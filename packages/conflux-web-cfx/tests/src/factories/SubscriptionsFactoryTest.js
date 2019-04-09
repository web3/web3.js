import * as Utils from 'conflux-web-utils';
import {formatters} from 'conflux-web-core-helpers';
import {
    LogSubscription,
    NewHeadsSubscription,
    NewPendingTransactionsSubscription,
    SyncingSubscription
} from 'conflux-web-core-subscriptions';

import SubscriptionsFactory from '../../../src/factories/SubscriptionsFactory';

// Mocks
jest.mock('conflux-web-utils');
jest.mock('conflux-web-core-helpers');
jest.mock('conflux-web-core-subscriptions');

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

    it('calls getSubscription and throws an error', () => {
        expect(() => {
            subscriptionsFactory.getSubscription({}, 'blub', {});
        }).toThrow('Unknown subscription: blub');
    });
});
