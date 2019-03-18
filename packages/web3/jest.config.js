const jestConfig = require('../../jest.config');

module.exports = jestConfig({
    'Eth': 'web3-eth',
    'Shh': 'web3-shh',
    'Bzz': 'web3-bzz',
    'Network': 'web3-net',
    'Personal': 'web3-eth-personal',
    'Utils': 'web3-utils'
});
