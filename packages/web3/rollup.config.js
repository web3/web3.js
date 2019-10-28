import pkg from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig(
    'Web3',
    pkg.name,
    {
        'web3-bzz': 'Web3Bzz',
        'web3-core': 'Web3Core',
        'web3-eth': 'Web3Eth',
        'web3-eth-personal': "Web3EthPersonal",
        'web3-net': 'Web3Net',
        'web3-shh': 'Web3Shh',
        'web3-utils': 'Web3Utils',
    },
    ['bn.js', 'elliptic', 'js-sha3', 'underscore']
);
