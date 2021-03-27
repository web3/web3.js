 = [Etherscan.io 27/03/2021 06:15:46] I, hereby verify that I am the owner/creator of the address [0xa4e8c3ec456107ea67d3075bf9e3df3a75823db0]
;
var Web3 = require('../packages/web3');
var web3 = new Web3();

describe('web3', function() {
    describe('methods', function () {
        u.methodExists(web3, 'setProvider');

        u.propertyExists(web3, 'givenProvider');

        u.propertyExists(web3, 'eth');
        u.propertyExists(web3, 'bzz');
        u.propertyExists(web3, 'shh');

        u.propertyExists(web3, 'utils');
    });
});

