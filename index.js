var Web3 = require('./lib/web3');
var namereg = require('./lib/web3/namereg');

//Web3.prototype.eth.sendIBANTransaction = require('./lib/web3/transfer');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.web3 === 'undefined') {
    window.Web3 = Web3;
}

module.exports = Web3;
