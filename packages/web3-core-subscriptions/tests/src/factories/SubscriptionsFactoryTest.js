import LogSubscription from '../../../src/subscriptions/eth/LogSubscription';
import SubscriptionsFactory from '../../../src/factories/SubscriptionsFactory';
import NewHeadsSubscription from '../../../src/subscriptions/eth/NewHeadsSubscription';
import NewPendingTransactionsSubscription from '../../../src/subscriptions/eth/NewPendingTransactionsSubscription';
import SyncingSubscription from '../../../src/subscriptions/eth/SyncingSubscription';
import MessagesSubscription from '../../../src/subscriptions/shh/MessagesSubscription';

// Mocks
jest.mock('');

/**
 * SubscriptionsFactory test
 */
describe('SubscriptionsFactoryTest', () => {
    let subscriptionsFactory;

    beforeEach(() => {
        subscriptionsFactory = new SubscriptionsFactory({}, {});
    });

    it('createLogSubscription returns LogSubscription', () => {
        expect(subscriptionsFactory.createLogSubscription()).toBeInstanceOf(LogSubscription);
    });

    it('createNewHeadsSubscription returns NewHeadsSubscription', () => {
        expect(subscriptionsFactory.createNewHeadsSubscription()).toBeInstanceOf(NewHeadsSubscription);
    });

    it('createNewPendingTransactionsSubscription returns NewPendingTransactionsSubscription', () => {
        expect(subscriptionsFactory.createNewPendingTransactionsSubscription()).toBeInstanceOf(
            NewPendingTransactionsSubscription
        );
    });

    it('createSyncingSubscription returns SyncingSubscription', () => {
        expect(subscriptionsFactory.createSyncingSubscription()).toBeInstanceOf(SyncingSubscription);
    });

    it('createShhMessagesSubscription returns MessagesSubscription', () => {
        expect(subscriptionsFactory.createShhMessagesSubscription()).toBeInstanceOf(MessagesSubscription);
    });
});
