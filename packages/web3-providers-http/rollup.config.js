import pkg from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig(
    'Web3HttpProvider',
    pkg.name,
    {
        'web3-core-helpers': 'Web3CoreHelpers'
    },
    [
        'bn.js',
        'elliptic',
        'js-sha3',
        'underscore'
    ]
);
