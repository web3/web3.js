import pkg from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig(
    'Web3CoreMethod',
    pkg.name,
    {
        'web3-core-helpers': 'Web3CoreHelpers',
        'web3-core-promievent': 'Web3CorePromiEvent',
        'web3-core-subscriptions': 'Web3CoreSubscriptions',
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
