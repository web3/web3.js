import {MessagesSubscription} from 'web3-core-subscriptions';
import SubscriptionsFactory from '../../../src/factories/SubscriptionsFactory';

// Mocks
jest.mock('MessagesSubscription');

/**
 * SubscriptionsFactory test
 */
describe('SubscriptionsFactoryTest', () => {
    let subscriptionsFactory;

    beforeEach(() => {
        subscriptionsFactory = new SubscriptionsFactory({}, {});
    });

    it('constructor check', () => {
        expect(subscriptionsFactory.utils).toEqual({});

        expect(subscriptionsFactory.formatters).toEqual({});
    });

    it('calls getSubscription and returns the MessagesSubscription', () => {
        expect(subscriptionsFactory.getSubscription({}, 'messages', 'options')).toBeInstanceOf(MessagesSubscription);

        expect(MessagesSubscription).toHaveBeenCalledTimes(1);
    });

    it('calls getSubscription and throws an error', () => {
        expect(() => {
            subscriptionsFactory.getSubscription({}, 'ERROR', 'options');
        }).toThrow('Unknown subscription: ERROR');
    });
});
