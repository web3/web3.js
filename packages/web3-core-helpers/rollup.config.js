import pkg from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig(
    'Web3CoreHelpers',
    pkg.name,
    {
        'web3-eth-iban': 'Web3EthIban',
        'web3-utils': 'Web3Utils',
        'underscore': '_'
    },
    ['bn.js', 'elliptic', 'js-sha3', 'underscore'],
    true
);
