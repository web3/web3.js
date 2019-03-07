const jestConfig = require('../../jest.config');

module.exports = jestConfig({
    'WebsocketProvider': 'web3-providers',
    'HttpProvider': 'web3-providers',
    'AbstractWeb3Module': 'web3-core',
    'Utils': 'web3-utils',
    'formatters': 'web3-core-helpers',
    'AbstractSubscription': 'web3-core-subscriptions'
});
