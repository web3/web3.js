const jestConfig = require('../../jest.config');

module.exports = jestConfig(
    {
        'SocketProviderAdapter': 'web3-providers',
        'HttpProviderAdapter': 'web3-providers',
        'AbstractWeb3Module': 'web3-core',
        'Utils': 'web3-utils',
        'formatters': 'web3-core-helpers',
        'Subscription': 'web3-core-subscriptions',
        'SubscriptionsFactory': 'web3-core-subscriptions',
        'AbstractSubscription': 'web3-core-subscriptions'
    }
);
