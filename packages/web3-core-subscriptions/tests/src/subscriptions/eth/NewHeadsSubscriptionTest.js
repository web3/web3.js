import NewHeadsSubscription from '../../../../src/subscriptions/eth/NewHeadsSubscription';

/**
 * NewHeadsSubscription test
 */
describe('NewHeadsSubscriptionTest', () => {
    let newHeadsSubscription;

    beforeEach(() => {
        newHeadsSubscription = new NewHeadsSubscription({});
    });

    it('constructor check', () => {
        expect(newHeadsSubscription.method).toEqual('newHeads');

        expect(newHeadsSubscription.type).toEqual('eth_subscribe');

        expect(newHeadsSubscription.options).toEqual(null);

        expect(newHeadsSubscription.moduleInstance).toEqual({});
    });

    it('onNewSubscriptionItem should call the outputBlockFormatter method', () => {
        newHeadsSubscription.onNewSubscriptionItem('string');
    });
});
