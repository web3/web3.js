import {formatters} from 'conflux-web-core-helpers';
import SyncingSubscription from '../../../../src/subscriptions/eth/SyncingSubscription';

// Mocks
jest.mock('conflux-web-core-helpers');

/**
 * SyncingSubscription test
 */
describe('SyncingSubscriptionTest', () => {
    let syncingSubscription;

    beforeEach(() => {
        syncingSubscription = new SyncingSubscription({}, formatters, {});
    });

    it('constructor check', () => {
        expect(syncingSubscription.isSyncing).toEqual(null);

        expect(syncingSubscription.method).toEqual('syncing');

        expect(syncingSubscription.type).toEqual('eth_subscribe');

        expect(syncingSubscription.options).toEqual(null);

        expect(syncingSubscription.utils).toEqual({});

        expect(syncingSubscription.formatters).toEqual(formatters);

        expect(syncingSubscription.moduleInstance).toEqual({});
    });

    it('onNewSubscriptionItem calls outputSyncingFormatter and emits "changed" event (isSyncing: null)', (done) => {
        const item = {result: {syncing: true}};

        syncingSubscription.on('changed', (subscriptionItem) => {
            expect(subscriptionItem).toEqual(true);

            done();
        });

        syncingSubscription.onNewSubscriptionItem(item);

        expect(formatters.outputSyncingFormatter).toHaveBeenCalledWith(item);
    });

    it('onNewSubscriptionItem calls outputSyncingFormatter and emits "changed" event (isSyncing: true)', (done) => {
        const item = {result: {syncing: false}};

        syncingSubscription.on('changed', (subscriptionItem) => {
            expect(subscriptionItem).toEqual(item.result.syncing);

            done();
        });

        syncingSubscription.isSyncing = true;
        syncingSubscription.onNewSubscriptionItem(item);

        expect(formatters.outputSyncingFormatter).toHaveBeenCalledWith(item);
    });

    it('onNewSubscriptionItem calls outputSyncingFormatter and emits "changed" event (isSyncing: false)', (done) => {
        const item = {result: {syncing: true}};

        syncingSubscription.on('changed', (subscriptionItem) => {
            expect(subscriptionItem).toEqual(item.result.syncing);

            done();
        });

        syncingSubscription.isSyncing = false;
        syncingSubscription.onNewSubscriptionItem(item);

        expect(formatters.outputSyncingFormatter).toHaveBeenCalledWith(item);
    });
});
