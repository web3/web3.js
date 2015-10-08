var Web3 = require('./lib/web3');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.web3 === 'undefined') {
    window.Web3 = Web3;
}

module.exports = Web3;
