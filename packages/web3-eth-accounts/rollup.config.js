import pkg from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig(
    'Web3EthAccounts',
    pkg.name,
    {
        'web3-core': 'Web3Core',
        'web3-core-helpers': 'Web3CoreHelpers',
        'web3-core-method': 'Web3CoreMethod',
        'web3-utils': 'Web3Utils',
        'underscore': '_'
    },
    [
        'bn.js',
        'elliptic',
        'js-sha3',
        'underscore'
    ]
);
