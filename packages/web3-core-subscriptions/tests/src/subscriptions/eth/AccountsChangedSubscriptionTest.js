import AccountsChangedSubscription from '../../../../src/subscriptions/eth/AccountsChangedSubscription';

/**
 * AccountsChangedSubscription test
 */
describe('AccountsChangedSubscriptionTest', () => {
    let accountsChangedSubscription;

    beforeEach(() => {
        accountsChangedSubscription = new AccountsChangedSubscription({}, {}, {});
    });

    it('constructor check', () => {
        expect(accountsChangedSubscription.method).toEqual('accountsChanged');

        expect(accountsChangedSubscription.utils).toEqual({});

        expect(accountsChangedSubscription.formatters).toEqual({});

        expect(accountsChangedSubscription.moduleInstance).toEqual({});
    });
});
