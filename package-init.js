/* jshint ignore:start */


// Browser environment
if(typeof window !== 'undefined') {

    if(typeof window.web3 === 'undefined') {
        web3 = require('web3');
        BigNumber = require('bignumber.js');
    } else {
        web3 = window.web3;
        BigNumber = window.BigNumber
    }
}


// Node environment
if(typeof global !== 'undefined') {
    if(typeof global.web3 === 'undefined') {
        web3 = require('web3');
        BigNumber = require('bignumber.js');
    } else {
        web3 = global.web3;
        BigNumber = global.BigNumber
    }
}

/* jshint ignore:end */