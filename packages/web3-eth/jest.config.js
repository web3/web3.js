const jestConfig = require('../../jest.config');

module.exports = jestConfig({
    HttpProvider: 'web3-providers',
    ProvidersModuleFactory: 'web3-providers',
    ProviderDetector: 'web3-providers',
    ProviderResolver: 'web3-providers',
    MethodModuleFactory: 'web3-core-method',
    GetPastLogsMethod: 'web3-core-method',
    SubscriptionsFactory: 'web3-core-subscriptions',
    LogSubscription: 'web3-core-subscriptions',
    AbstractSubscription: 'web3-core-subscriptions',
    formatters: 'web3-core-helpers',
    Accounts: 'web3-eth-accounts',
    ContractModuleFactory: 'web3-eth-contract',
    AbiCoder: 'web3-eth-abi',
    Ens: 'web3-eth-ens',
    Personal: 'web3-eth-personal',
    Network: 'web3-net',
    Utils: 'web3-utils',
    AbstractContract: 'web3-eth-contract'
});
