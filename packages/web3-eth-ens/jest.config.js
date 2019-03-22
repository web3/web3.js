const jestConfig = require('../../jest.config');

module.exports = jestConfig({
    ContractModuleFactory: 'web3-eth-contract',
    formatters: 'web3-core-helpers',
    Utils: 'web3-utils',
    AbiCoder: 'web3-eth-abi',
    Network: 'web3-net',
    namehash: 'eth-ens-namehash'
});
