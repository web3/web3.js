import pkg from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig(
    'Web3EthContract',
    pkg.name,
    {
        'web3-core': 'Web3Core',
        'web3-core-helpers': 'Web3CoreHelpers',
        'web3-core-method': 'Web3CoreMethod',
        'web3-core-promievent': 'Web3CorePromiEvent',
        'web3-core-subscriptions': 'Web3CoreSubscriptions',
        'web3-eth-abi': 'Web3EthAbi',
        'web3-utils': 'Web3Utils',
        'underscore': '_'
    },
    [
        'bn.js',
        'js-sha3',
        'underscore'
    ]
);
