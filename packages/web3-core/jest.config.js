const jestConfig = require('../../jest.config');

module.exports = jestConfig({
    ProvidersModuleFactory: 'web3-providers',
    ProviderDetector: 'web3-providers',
    ProviderResolver: 'web3-providers',
    BatchRequest: 'web3-providers',
    WebsocketProvider: 'web3-providers',
    HttpProvider: 'web3-providers',
    IpcProvider: 'web3-providers'
});
