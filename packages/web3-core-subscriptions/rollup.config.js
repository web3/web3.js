import pkg from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig(
    'Web3CoreSubscriptions',
    pkg.name,
    {
        'web3-core-helpers': 'Web3CoreHelpers',
        'underscore': '_',
        'eventemitter3': 'EventEmitter'
    },
    [
        'bn.js',
        'underscore'
    ],
    true
);
