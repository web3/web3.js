import NewPendingTransactionsSubscription from '../../../../src/subscriptions/eth/NewPendingTransactionsSubscription';

/**
 * NewPendingTransactionsSubscription test
 */
describe('NewPendingTransactionsSubscriptionTest', () => {
    let newPendingTransactionsSubscription;

    beforeEach(() => {
        newPendingTransactionsSubscription = new NewPendingTransactionsSubscription({}, {}, {});
    });

    it('constructor check', () => {
        expect(newPendingTransactionsSubscription.method)
            .toEqual('syncing');

        expect(newPendingTransactionsSubscription.type)
            .toEqual('eth_subscribe');

        expect(newPendingTransactionsSubscription.options)
            .toEqual(null);

        expect(newPendingTransactionsSubscription.utils)
            .toEqual({});

        expect(newPendingTransactionsSubscription.moduleInstance)
            .toEqual({});
    });
});
