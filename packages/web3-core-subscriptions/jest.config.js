const jestConfig = require('../../jest.config');

module.exports = jestConfig({
    Utils: 'web3-utils',
    formatters: 'web3-core-helpers'
});
