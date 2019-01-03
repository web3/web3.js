const jestConfig = require('../../jest.config');

module.exports = jestConfig({
    'formatters': 'web3-core-helpers',
    'AbiCoder': 'web3-eth-abi',
    'MethodModuleFactory': 'web3-core-method',
    'EstimateGasMethod': 'web3-core-method',
    'GetPastLogsMethod': 'web3-core-method',
    'Accounts': 'web3-eth-accounts',
    'Utils': 'web3-utils',
});
