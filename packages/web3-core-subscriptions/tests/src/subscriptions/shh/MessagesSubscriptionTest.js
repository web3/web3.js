import MessagesSubscription from '../../../../src/subscriptions/shh/MessagesSubscription';

/**
 * MessagesSubscription test
 */
describe('MessagesSubscriptionTest', () => {
    let messagesSubscription;

    beforeEach(() => {
        messagesSubscription = new MessagesSubscription({}, {});
    });

    it('constructor check', () => {
        expect(messagesSubscription.method).toEqual('messages');

        expect(messagesSubscription.type).toEqual('shh_subscribe');

        expect(messagesSubscription.options).toEqual({});

        expect(messagesSubscription.utils).toEqual({});

        expect(messagesSubscription.formatters).toEqual({});

        expect(messagesSubscription.moduleInstance).toEqual({});
    });
});
