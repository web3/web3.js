/* jshint ignore:start */


// Browser environment
if(typeof window !== 'undefined') {
    Web3 = (typeof window.Web3 !== 'undefined') ? window.Web3 : require('web3');
    BigNumber = (typeof window.BigNumber !== 'undefined') ? window.BigNumber : require('bn.js');
}


// Node environment
if(typeof global !== 'undefined') {
    Web3 = (typeof global.Web3 !== 'undefined') ? global.Web3 : require('web3');
    BigNumber = (typeof global.BigNumber !== 'undefined') ? global.BigNumber : require('bn.js');
}

/* jshint ignore:end */
