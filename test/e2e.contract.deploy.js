var assert = require('assert');
var Web3 = require('../packages/web3');
var Basic = require('./sources/Basic');
var Reverts = require('./sources/Reverts');
var utils = require('./helpers/test.utils');

describe('contract.deploy [ @E2E ]', function() {
    var web3;
    var accounts;
    var basic;
    var reverts;
    var options;

    // Error message variants
    var ganacheRevert = "revert";
    var gethRevert = "code couldn't be stored";

    var basicOptions = {
        data: Basic.bytecode,
        gasPrice: '1',
        gas: 4000000
    };

    var revertsOptions = {
        data: Reverts.bytecode,
        gasPrice: '1',
        gas: 4000000
    }

    describe('http', function() {
        before(async function(){
            web3 = new Web3('http://localhost:8545');
            accounts = await web3.eth.getAccounts();

            basic = new web3.eth.Contract(Basic.abi, basicOptions);
            reverts = new web3.eth.Contract(Reverts.abi, revertsOptions);
        })

        it('returns an instance', async function(){
            var instance = await basic.deploy().send({from: accounts[0]})
            assert(web3.utils.isAddress(instance.options.address));
        });

        it('errors on OOG', async function(){
            try {
                await basic.deploy().send({from: accounts[0], gas: 1000});
                assert.fail();
            } catch(err){
                assert(err.message.includes('gas'))
            }
        });

        it('errors on revert', async function(){
            try {
                await reverts.deploy().send({from: accounts[0]});
                assert.fail();
            } catch(err){
                assert(
                    err.message.includes(gethRevert) ||
                    err.message.includes(ganacheRevert)
                );
            }
        });
    });

    describe('ws', function() {
        // Websockets extremely erratic for geth instamine...
        if (process.env.GETH_INSTAMINE) return;

        before(async function(){
            // Ganache runs ws and http over the same port
            var port = process.env.GANACHE ?  8545 : 8546;

            web3 = new Web3('ws://localhost:' + port);
            accounts = await web3.eth.getAccounts();

            basic = new web3.eth.Contract(Basic.abi, basicOptions);
            reverts = new web3.eth.Contract(Reverts.abi, revertsOptions);
        })

        it('returns an instance', async function(){
            var instance = await basic.deploy().send({from: accounts[0]})
            assert(web3.utils.isAddress(instance.options.address));
        });

        it('errors on OOG', async function(){
            try {
                await basic.deploy().send({from: accounts[0], gas: 1000});
                assert.fail();
            } catch(err){
                assert(err.message.includes('gas'))
            }
        });

        it('errors on revert', async function(){
            try {
                await reverts.deploy().send({from: accounts[0]});
                assert.fail();
            } catch(err){
                assert(
                    err.message.includes(gethRevert) ||
                    err.message.includes(ganacheRevert)
                );
            }
        });

        it('fires the transaction event', function(done){
            basic.deploy().send({from: accounts[0]})

                .on('transactionHash', hash => {
                    assert(web3.utils.isHex(hash))
                    done();
                })

        });

        it('fires the receipt event', function(done){
            basic.deploy().send({from: accounts[0]})

                .on('receipt', receipt => {
                    assert(web3.utils.isAddress(receipt.contractAddress))
                    done();
                })
        })

        // Confirmation handling somewhat broken right now...
        it('fires the confirmation handler', function(){

            return new Promise(async (resolve, reject) => {
                await basic.deploy().send({from: accounts[0]})

                    // With geth automine it's (incorrectly) fired every second
                    .on('confirmation', (number, receipt) => {
                        resolve();
                    })

                // Necessary for instamine, should not interfere with automine.
                await utils.mine(web3, accounts[0]);
            });
        });

        it('fires the error handler on OOG', function(done){
            basic.deploy().send({from: accounts[0], gas: 1000})

                .on('error', err => {
                    assert(err.message.includes('gas'))
                    done();
                })
        })

        it('fires the error handler on revert', function(done){
            reverts.deploy().send({from: accounts[0]})

                .on('error', err => {
                    assert(
                        err.message.includes(gethRevert) ||
                        err.message.includes(ganacheRevert)
                    );

                    done();
                })
        })
    });
});

