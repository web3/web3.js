const jestConfig = require('../../jest.config');

module.exports = jestConfig(
    {
        'ProvidersModuleFactory': 'web3-providers',
        'ProviderDetector': 'web3-providers',
        'ProviderAdapterResolver': 'web3-providers',
        'BatchRequest': 'web3-providers',
        'SocketProviderAdapter': 'web3-providers'
    }
);
