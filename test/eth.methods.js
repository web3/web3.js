var assert = require('assert');
var web3 = require('../index.js');
var u = require('./test.utils.js');

describe('web3', function() {
    describe('eth', function() {
        u.methodExists(web3.eth, 'balanceAt');
        u.methodExists(web3.eth, 'stateAt');
        u.methodExists(web3.eth, 'storageAt');
        u.methodExists(web3.eth, 'countAt');
        u.methodExists(web3.eth, 'codeAt');
        u.methodExists(web3.eth, 'transact');
        u.methodExists(web3.eth, 'call');
        u.methodExists(web3.eth, 'block');
        u.methodExists(web3.eth, 'transaction');
        u.methodExists(web3.eth, 'uncle');
        u.methodExists(web3.eth, 'compilers');
        u.methodExists(web3.eth, 'lll');
        u.methodExists(web3.eth, 'solidity');
        u.methodExists(web3.eth, 'serpent');
        u.methodExists(web3.eth, 'logs');
        u.methodExists(web3.eth, 'transactionCount');
        u.methodExists(web3.eth, 'uncleCount');

        u.propertyExists(web3.eth, 'coinbase');
        u.propertyExists(web3.eth, 'listening');
        u.propertyExists(web3.eth, 'mining');
        u.propertyExists(web3.eth, 'gasPrice');
        u.propertyExists(web3.eth, 'accounts');
        u.propertyExists(web3.eth, 'peerCount');
        u.propertyExists(web3.eth, 'defaultBlock');
        u.propertyExists(web3.eth, 'number');
    });

    // Fail at the moment
    // describe('eth', function(){
    //     it('should be a positive balance', function() {
    //         // when
    //         var testAddress = '0x50f4ed0e83f9da907017bcfb444e3e25407f59bb';
    //         var balance = web3.eth.balanceAt(testAddress);
    //         // then
    //         assert(balance > 0, 'Balance is ' + balance);
    //     });

    //     it('should return a block', function() {
    //         // when
    //         var block = web3.eth.block(0);
            
    //         // then
    //         assert.notEqual(block, null);
    //         assert.equal(block.number, 0);
    //         assert(web3.toDecimal(block.difficulty) > 0);
    //     });
    // });
});


