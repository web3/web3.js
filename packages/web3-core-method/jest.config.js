const jestConfig = require('../../jest.config');

module.exports = jestConfig(
    {
        'SocketProviderAdapter': 'web3-providers',
        'AbstractWeb3Module': 'web3-core'
    }
);
