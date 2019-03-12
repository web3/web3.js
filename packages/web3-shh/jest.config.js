const jestConfig = require('../../jest.config');

module.exports = jestConfig({
    Utils: 'web3-utils',
    formatters: 'web3-core-helpers',
    AbstractSubscription: 'web3-core-subscriptions',
    MessagesSubscription: 'web3-core-subscriptions',
    HttpProvider: 'web3-providers',
    Network: 'web3-net',
    AbstractWeb3Module: 'web3-core'
});
