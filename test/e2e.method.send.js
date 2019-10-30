const assert = require('assert');
const Basic = require('./sources/Basic');
const utils = require('./helpers/test.utils');
const Web3 = utils.getWeb3();

describe('method.send [ @E2E ]', function() {
    let web3;
    let accounts;
    let basic;
    let instance;

    let basicOptions = {
        data: Basic.bytecode,
        gasPrice: '1',
        gas: 4000000
    };

    describe('http', function() {
        before(async function() {
            web3 = new Web3('http://localhost:8545');
            accounts = await web3.eth.getAccounts();

            basic = new web3.eth.Contract(Basic.abi, basicOptions);
            instance = await basic.deploy().send({from: accounts[0]});
        });

        it('returns a receipt', async function() {
            const receipt = await instance
                .methods
                .setValue('1')
                .send({from: accounts[0]});

            assert(receipt.status === true);
            assert(web3.utils.isHexStrict(receipt.transactionHash));
        });

        it('errors on OOG', async function() {
            try {
                await instance
                    .methods
                    .setValue('1')
                    .send({from: accounts[0], gas: 100});

                assert.fail();

            } catch (err) {
                assert(err.message.includes('gas'));
            }
        });

        it('errors on revert', async function() {
            try {
                await instance
                    .methods
                    .reverts()
                    .send({from: accounts[0]});

                assert.fail();

            } catch (err) {
                const receipt = utils.extractReceipt(err.message);

                assert(err.message.includes('revert'));
                assert(receipt.status === false);
            }
        });
    });

    describe('ws', function() {
        // Websockets extremely erratic for geth instamine...
        if (process.env.GETH_INSTAMINE) return;

        before(async function() {
            const port = utils.getWebsocketPort();

            web3 = new Web3('ws://localhost:' + port);
            accounts = await web3.eth.getAccounts();

            basic = new web3.eth.Contract(Basic.abi, basicOptions);
            instance = await basic.deploy().send({from: accounts[0]});
        });

        it('returns a receipt', async function() {
            const receipt = await instance
                .methods
                .setValue('1')
                .send({from: accounts[0]});

            assert(receipt.status === true);
            assert(web3.utils.isHexStrict(receipt.transactionHash));
        });

        it('errors on OOG', async function() {
            try {
                await instance
                    .methods
                    .setValue('1')
                    .send({from: accounts[0], gas: 100});

                assert.fail();

            } catch (err) {
                assert(err.message.includes('gas'));
            }
        });

        it('errors on revert', async function() {
            try {
                await instance
                    .methods
                    .reverts()
                    .send({from: accounts[0]});

                assert.fail();

            } catch (err) {
                const receipt = utils.extractReceipt(err.message);

                assert(err.message.includes('revert'));
                assert(receipt.status === false);
            }
        });

        it('fires the transactionHash event', function(done) {
            instance
                .methods
                .setValue('1')
                .send({from: accounts[0]})
                .on('transactionHash', hash => {
                    assert(web3.utils.isHex(hash));
                    done();
                });
        });

        it('fires the receipt event', function(done) {
            instance
                .methods
                .setValue('1')
                .send({from: accounts[0]})
                .on('receipt', receipt => {
                    assert(receipt.status === true);
                    done();
                });
        });

        it('fires the confirmation handler', function() {
            return new Promise(async function(resolve) {
                const startBlock = await web3.eth.getBlockNumber();

                await instance
                    .methods
                    .setValue('1')
                    .send({from: accounts[0]})
                    .on('confirmation', async function(number) {
                        if (number === 1) { // Confirmation numbers are zero indexed
                            const endBlock = await web3.eth.getBlockNumber();
                            assert(endBlock >= (startBlock + 2));
                            resolve();
                        }
                    });

                // Necessary for instamine, should not interfere with automine.
                await utils.mine(web3, accounts[0]);
            });
        });

        it('fires the error handler on OOG', function(done) {
            instance
                .methods
                .setValue('1')
                .send({from: accounts[0], gas: 100})
                .on('error', err => {
                    assert(err.message.includes('gas'));
                    done();
                });
        });

        it('fires the error handler on revert', function(done) {
            instance
                .methods
                .reverts()
                .send({from: accounts[0]})
                .on('error', err => {
                    assert(err.message.includes('revert'));
                    done();
                });
        });
    });
});

