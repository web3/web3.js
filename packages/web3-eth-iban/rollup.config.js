import pkg from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig(
    'Web3EthIban',
    pkg.name,
    {
        'web3-utils': 'Web3Utils',
        'bn.js': 'BN'
    },
    [
        'bn.js',
        'elliptic',
        'js-sha3',
        'underscore'
    ]
);
