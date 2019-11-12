import pkg from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig(
    'Web3EthEns',
    pkg.name,
    {
        'web3-core': 'Web3Core',
        'web3-core-helpers': 'Web3CoreHelpers',
        'web3-core-promievent': 'Web3CorePromiEvent',
        'web3-utils': 'Web3Utils',
        'underscore': '_',
        'eth-ens-namehash': 'namehash'
    },
    [
        'bn.js',
        'elliptic',
        'js-sha3',
        'underscore'
    ]
);
