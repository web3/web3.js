const jestConfig = require('../../jest.config');

module.exports = jestConfig({
    formatters: 'web3-core-helpers',
    Utils: 'web3-utils',
    HttpProvider: 'web3-providers',
    ProvidersModuleFactory: 'web3-providers',
    ProviderDetector: 'web3-providers',
    ProviderResolver: 'web3-providers',
    MethodModuleFactory: 'web3-core-method',
    Network: 'web3-net'
});
