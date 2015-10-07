var Web3 = require('./lib/web3');
var namereg = require('./lib/web3/namereg');

//Web3.prototype.providers.HttpProvider = require('./lib/web3/httpprovider');
//Web3.prototype.providers.IpcProvider = require('./lib/web3/ipcprovider');

//Web3.prototype.eth.contract = require('./lib/web3/contract');
//Web3.prototype.eth.namereg = namereg.namereg;
//Web3.prototype.eth.ibanNamereg = namereg.ibanNamereg;
//Web3.prototype.eth.sendIBANTransaction = require('./lib/web3/transfer');
//Web3.prototype.eth.iban = require('./lib/web3/iban');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.web3 === 'undefined') {
    window.Web3 = Web3;
}

module.exports = Web3;
