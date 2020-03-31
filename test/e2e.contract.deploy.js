var assert = require('assert');
var Basic = require('./sources/Basic');
var Reverts = require('./sources/Reverts');
var utils = require('./helpers/test.utils');
var Web3 = utils.getWeb3();

describe('contract.deploy [ @E2E ]', function() {
    var web3;
    var accounts;
    var basic;
    var reverts;
    var noBytecode;
    var options;

    // Error message variants
    var revertMessage = "revert";
    var couldNotBeStoredMessage = "code couldn't be stored";
    var creationWithoutDataMessage = "contract creation without any data provided";

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

    var noBytecodeOptions = {
        data: '0x',
        gasPrice: '1',
        gas: 4000000
    }

    describe('http', function() {
        before(async function(){
            web3 = new Web3('http://localhost:8545');
            accounts = await web3.eth.getAccounts();

            basic = new web3.eth.Contract(Basic.abi, basicOptions);
            reverts = new web3.eth.Contract(Reverts.abi, revertsOptions);
            noBytecode = new web3.eth.Contract(Basic.abi, noBytecodeOptions);
        })

        it('returns an instance', async function(){
            var instance = await basic
                .deploy()
                .send({from: accounts[0]});

            assert(web3.utils.isAddress(instance.options.address));
        });

        // Clients reject this kind of OOG is early because
        // the gas is obviously way too low.
        it('errors on "intrinic gas too low" OOG', async function(){
            try {
                await basic
                    .deploy()
                    .send({from: accounts[0], gas: 1000});

                assert.fail();
            } catch(err){
                assert(err.message.includes('gas'))
                assert(err.receipt === undefined);
            }
        });

        // Clients reject this kind of OOG when the EVM runs out of gas
        // while running the code. A contractAddress is set on the
        // receipt, but the status will be false.
        it('errors on OOG reached while running EVM', async function(){
            const estimate = await basic
                .deploy()
                .estimateGas()

            const gas = estimate - 1000;

            try {
                await basic
                    .deploy()
                    .send({from: accounts[0], gas: gas});

                assert.fail();
            } catch(err){
                assert(err.message.includes(couldNotBeStoredMessage));
                assert(err.receipt.status === false);
            }
        });

        // Geth immediately rejects a zero length bytecode without mining,
        // Ganache accepts and mines it, returning a receipt with status === true
        it('errors deploying a zero length bytecode', async function(){
            try {
                await noBytecode
                    .deploy()
                    .send({from: accounts[0]});

                assert.fail();
            } catch(err){
                assert(
                    err.message.includes(creationWithoutDataMessage) ||
                    err.message.includes(couldNotBeStoredMessage)
                );
            }
        })

        it('errors on revert', async function(){
            try {
                await reverts
                    .deploy()
                    .send({from: accounts[0]});

                assert.fail();
            } catch(err){
                assert(
                    err.message.includes(couldNotBeStoredMessage) ||
                    err.message.includes(revertMessage)
                );

                assert(err.receipt.status === false);
            }
        });

        it('fires the confirmation handler', function(){
            // Http confirmations poll at 1s interval.
            // Automine has a 2s interval.
            if (!process.env.GETH_AUTOMINE) return;

            return new Promise(async (resolve, reject) => {
                var startBlock = await web3.eth.getBlockNumber();

                await basic
                    .deploy()
                    .send({from: accounts[0]})
                    .on('confirmation', async (number, receipt) => {
                        assert(receipt.contractAddress);

                        if (number === 1) { // Confirmation numbers are zero indexed
                            var endBlock = await web3.eth.getBlockNumber();
                            assert(endBlock >= (startBlock + 2));
                            resolve();
                        }
                    })
            });
        });
    });

    describe('ws', function() {
        // Websockets extremely erratic for geth instamine...
        if (process.env.GETH_INSTAMINE) return;

        before(async function(){
            var port = utils.getWebsocketPort();

            web3 = new Web3('ws://localhost:' + port);
            accounts = await web3.eth.getAccounts();

            basic = new web3.eth.Contract(Basic.abi, basicOptions);
            reverts = new web3.eth.Contract(Reverts.abi, revertsOptions);
        })

        it('returns an instance', async function(){
            var instance = await basic
                .deploy()
                .send({from: accounts[0]})

            assert(web3.utils.isAddress(instance.options.address));
        });

        it('errors on OOG', async function(){
            try {
                await basic
                    .deploy()
                    .send({from: accounts[0], gas: 1000});

                assert.fail();
            } catch(err){
                assert(err.message.includes('gas'))
            }
        });

        it('errors on revert', async function(){
            try {
                await reverts
                    .deploy()
                    .send({from: accounts[0]});

                assert.fail();
            } catch(err){
                assert(
                    err.message.includes(couldNotBeStoredMessage) ||
                    err.message.includes(revertMessage)
                );
            }
        });

        it('fires the transactionHash event', function(done){
            basic
                .deploy()
                .send({from: accounts[0]})
                .on('transactionHash', hash => {
                    assert(web3.utils.isHex(hash))
                    done();
                })
        });

        it('fires the receipt event', function(done){
            basic
                .deploy()
                .send({from: accounts[0]})
                .on('receipt', receipt => {
                    assert(web3.utils.isAddress(receipt.contractAddress))
                    done();
                })
        })

        it('fires the confirmation handler', function(){
            return new Promise(async (resolve, reject) => {
                var startBlock = await web3.eth.getBlockNumber();

                await basic
                    .deploy()
                    .send({from: accounts[0]})
                    .on('confirmation', async (number, receipt) => {
                        if (number === 1) { // Confirmation numbers are zero indexed
                            var endBlock = await web3.eth.getBlockNumber();
                            assert(endBlock >= (startBlock + 2));
                            resolve();
                        }
                    })

                // Necessary for instamine, should not interfere with automine.
                await utils.mine(web3, accounts[0]);
            });
        });

        it('fires the error handler on OOG', function(done){
            basic
                .deploy()
                .send({from: accounts[0], gas: 1000})
                .on('error', err => {
                    assert(err.message.includes('gas'))
                    done();
                })
        })

        it('fires the error handler on revert', function(done){
            reverts
                .deploy()
                .send({from: accounts[0]})
                .on('error', err => {
                    assert(
                        err.message.includes(couldNotBeStoredMessage) ||
                        err.message.includes(revertMessage)
                    );
                    done();
                })
        })
    });
});

