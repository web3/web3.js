import EventSubscriptionFactory from '../../../src/factories/EventSubscriptionFactory';
import EventLogSubscription from '../../../src/subscriptions/EventLogSubscription';
import AllEventsLogSubscription from '../../../src/subscriptions/AllEventsLogSubscription';

// Mocks
jest.mock('../../../src/subscriptions/EventLogSubscription');
jest.mock('../../../src/subscriptions/AllEventsLogSubscription');

/**
 * EventSubscriptionFactory test
 */
describe('EventSubscriptionFactoryTest', () => {
    let eventSubscriptionFactory;

    beforeEach(() => {
        eventSubscriptionFactory = new EventSubscriptionFactory();
    });

    it('calls createEventLogSubscription and returns an EventLogSubscription object', () => {
        expect(eventSubscriptionFactory.createEventLogSubscription({}, {}, {}, {})).toBeInstanceOf(
            EventLogSubscription
        );
    });

    it('calls createAllEventsLogSubscription and returns an AllEventsLogSubscription object', () => {
        expect(eventSubscriptionFactory.createAllEventsLogSubscription({}, {}, {})).toBeInstanceOf(
            AllEventsLogSubscription
        );
    });
});
