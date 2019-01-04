const jestConfig = require('../../jest.config');

module.exports = jestConfig({
    'HttpProvider': 'web3-providers',
    'ProvidersModuleFactory': 'web3-providers',
    'MethodModuleFactory': 'web3-core-method',
    'formatters': 'web3-core-helpers',
    'Accounts': 'web3-eth-accounts',
    'ContractModuleFactory': 'web3-eth-contract',
    'AbiCoder': 'web3-eth-abi',
    'Utils': 'web3-utils'
});
