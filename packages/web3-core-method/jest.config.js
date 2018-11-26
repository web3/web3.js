const jestConfig = require('../../jest.config');

module.exports = jestConfig(
    {
        'WebsocketProvider': 'web3-providers',
        'SocketProviderAdapter': 'web3-providers',
        'AbstractWeb3Module': 'web3-core'
    }
);
