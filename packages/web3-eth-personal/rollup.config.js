import {name} from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig(
    'Web3EthPersonal',
    name,
    {
        'web3-core': 'Web3Core',
        'web3-core-helpers': 'Web3CoreHelpers',
        'web3-core-method': 'Web3CoreMethod',
        'web3-net': 'Web3Net',
        'web3-utils': 'Web3Utils'
    },
    ['bn.js', 'elliptic', 'js-sha3', 'underscore']
);
