const jestConfig = require('../../jest.config');

module.exports = jestConfig({
    'hexToBytes': 'web3-utils',
    'isHexStrict': 'web3-utils',
    'formatters': 'web3-core-helpers',
    'HttpProvider': 'web3-providers',
    'ProvidersModuleFactory': 'web3-providers',
    'ProviderDetector': 'web3-providers',
    'ProviderResolver': 'web3-providers',
    'GetGasPriceMethod': 'web3-core-method',
    'ChainIdMethod': 'web3-core-method',
    'GetTransactionCountMethod': 'web3-core-method',
    'MethodModuleFactory': 'web3-core-method',
    'scryptsy': 'scrypt.js'
});
