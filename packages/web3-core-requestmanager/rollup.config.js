import pkg from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig(
    'Web3CoreRequestManager',
    pkg.name,
    {
        'web3-core-helpers': 'Web3CoreHelpers',
        'web3-providers-http': 'Web3HttpProvider',
        'web3-providers-ipc': 'Web3IpcProvider',
        'web3-providers-ws': 'Web3WsProvider',
        'underscore': '_'
    },
    ['bn.js', 'elliptic', 'js-sha3', 'underscore'],
    true
);
