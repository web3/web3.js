import ChainChangedSubscription from '../../../../src/subscriptions/eth/ChainChangedSubscription';

/**
 * ChainChangedSubscription test
 */
describe('ChainChangedSubscriptionTest', () => {
    let chainChangedSubscription;

    beforeEach(() => {
        chainChangedSubscription = new ChainChangedSubscription({}, {}, {});
    });

    it('constructor check', () => {
        expect(chainChangedSubscription.method).toEqual('chainChanged');

        expect(chainChangedSubscription.utils).toEqual({});

        expect(chainChangedSubscription.formatters).toEqual({});

        expect(chainChangedSubscription.moduleInstance).toEqual({});
    });
});
