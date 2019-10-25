import pkg from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig(
    'Web3Core',
    pkg.name,
    {
        'web3-core-helpers': 'Web3CoreHelpers',
        'web3-core-method': 'Web3CoreMethod',
        'web3-core-requestmanager': 'Web3CoreRequestmanager',
        'web3-utils': 'Web3Utils',
    }
);
