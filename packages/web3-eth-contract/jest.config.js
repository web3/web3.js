const jestConfig = require('../../jest.config');

module.exports = jestConfig({
    'formatters': 'web3-core-helpers',
    'AbiCoder': 'web3-eth-abi'
});
