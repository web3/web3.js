import SyncingSubscription from '../../../../src/subscriptions/eth/SyncingSubscription';

/**
 * SyncingSubscription test
 */
describe('SyncingSubscriptionTest', () => {
    let syncingSubscription;

    beforeEach(() => {
        syncingSubscription = new SyncingSubscription({}, {}, {});
    });

    it('constructor check', () => {
        expect(syncingSubscription.isSyncing).toEqual(null);

        expect(syncingSubscription.method).toEqual('syncing');

        expect(syncingSubscription.type).toEqual('eth_subscribe');

        expect(syncingSubscription.options).toEqual(null);
    });

    it('calls onNewSubscriptionItem and emits the initial "changed" event', (done) => {
        const item = {syncing: true};

        syncingSubscription.on('changed', (subscriptionItem) => {
            expect(subscriptionItem).toEqual(true);

            done();
        });

        syncingSubscription.onNewSubscriptionItem(item);
    });

    it('calls onNewSubscriptionItem and emits the "changed" event', (done) => {
        const item = {syncing: false};

        syncingSubscription.on('changed', (subscriptionItem) => {
            expect(subscriptionItem).toEqual(false);

            done();
        });

        syncingSubscription.isSyncing = true;
        syncingSubscription.onNewSubscriptionItem(item);
    });

    it('calls onNewSubscriptionItem and returns the boolean', () => {
        expect(syncingSubscription.onNewSubscriptionItem(true)).toEqual(true);
    });

    it('calls onNewSubscriptionItem and returns the syncing status', () => {
        expect(syncingSubscription.onNewSubscriptionItem({status: true, syncing: true})).toEqual(true);
    });
});
