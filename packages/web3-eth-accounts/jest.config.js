const jestConfig = require('../../jest.config');

module.exports = jestConfig({
    Utils: 'web3-utils',
    formatters: 'web3-core-helpers',
    HttpProvider: 'web3-providers',
    ProvidersModuleFactory: 'web3-providers',
    ProviderDetector: 'web3-providers',
    ProviderResolver: 'web3-providers',
    MethodModuleFactory: 'web3-core-method'
});
