import NetworkChangedSubscription from '../../../../src/subscriptions/eth/NetworkChangedSubscription';

/**
 * NetworkChangedSubscription test
 */
describe('NetworkChangedSubscriptionTest', () => {
    let networkChangedSubscription;

    beforeEach(() => {
        networkChangedSubscription = new NetworkChangedSubscription({}, {}, {});
    });

    it('constructor check', () => {
        expect(networkChangedSubscription.method).toEqual('networkChanged');

        expect(networkChangedSubscription.utils).toEqual({});

        expect(networkChangedSubscription.formatters).toEqual({});

        expect(networkChangedSubscription.moduleInstance).toEqual({});
    });
});
