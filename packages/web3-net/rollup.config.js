import pkg from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig(
    'Web3Net',
    pkg.name,
    {
        'web3-core': 'Web3Core',
        'web3-core-method': 'Web3CoreMethod',
        'web3-utils': 'Web3Utils'
    }
);
