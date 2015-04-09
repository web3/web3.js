var web3 = require('./lib/web3');
web3.providers.HttpProvider = require('./lib/web3/httpprovider');
web3.providers.QtSyncProvider = require('./lib/web3/qtsync');
web3.eth.contract = require('./lib/web3/contract');
web3.abi = require('./lib/solidity/abi');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.web3 === 'undefined') {
    window.web3 = web3;
}

module.exports = web3;

