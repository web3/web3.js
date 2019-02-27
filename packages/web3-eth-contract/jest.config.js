const jestConfig = require('../../jest.config');

module.exports = jestConfig({
    'formatters': 'web3-core-helpers',
    'AbiCoder': 'web3-eth-abi',
    'MethodModuleFactory': 'web3-core-method',
    'EstimateGasMethod': 'web3-core-method',
    'GetPastLogsMethod': 'web3-core-method',
    'SendRawTransactionMethod': 'web3-core-method',
    'ChainIdMethod': 'web3-core-method',
    'GetTransactionCountMethod': 'web3-core-method',
    'Accounts': 'web3-eth-accounts',
    'HttpProvider': 'web3-providers',
    'ProvidersModuleFactory': 'web3-providers',
    'ProviderDetector': 'web3-providers',
    'ProviderResolver': 'web3-providers',
    'Utils': 'web3-utils'
});
