import pkg from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig(
    'Web3WsProvider',
    pkg.name,
    {
        'web3-core-helpers': 'Web3CoreHelpers',
        'underscore': '_'
    }
);
