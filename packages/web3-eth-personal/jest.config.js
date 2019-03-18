const jestConfig = require('../../jest.config');

module.exports = jestConfig({
    formatters: 'web3-core-helpers',
    Utils: 'web3-utils',
    Network: 'web3-net'
});
