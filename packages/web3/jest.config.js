const jestConfig = require('../../jest.config');

module.exports = jestConfig({
    HttpProvider: 'web3-providers',
    WebsocketProvider: 'web3-providers',
    IpcProvider: 'web3-providers',
    Eth: 'web3-eth',
    Shh: 'web3-shh',
    Bzz: 'web3-bzz',
    Network: 'web3-net',
    Personal: 'web3-eth-personal',
    Utils: 'web3-utils'
});
