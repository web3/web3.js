import pkg from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig(
    'Web3Shh',
    pkg.name,
    {
        'web3-core': 'Web3Core',
        'web3-core-method': 'Web3CoreMethod',
        'web3-core-subscriptions': 'Web3CoreSubscriptions',
        'web3-net': 'Web3Net'
    },
    [
        'bn.js',
        'elliptic',
        'underscore'
    ]
);
