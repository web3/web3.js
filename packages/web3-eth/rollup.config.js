import pkg from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig(
    'Web3Eth',
    pkg.name,
    {
        'web3-core': 'Web3Core',
        'web3-core-helpers': 'Web3CoreHelpers',
        'web3-core-method': 'Web3CoreMethod',
        'web3-core-subscriptions': 'Web3CoreSubscriptions',
        'web3-eth-abi': 'Web3EthAbi',
        'web3-eth-accounts': 'Web3EthAccounts',
        'web3-eth-contract': 'Web3EthContract',
        'web3-eth-ens': 'Web3EthEns',
        'web3-eth-iban': 'Web3EthIban',
        'web3-eth-personal': 'Web3EthPersonal',
        'web3-net': 'Web3Net',
        'web3-utils': 'Web3Utils',
        'underscore': '_'
    }
);
