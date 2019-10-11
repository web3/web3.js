var assert = require('assert');
var EJSCommon = require('ethereumjs-common');
var EJSTx = require('ethereumjs-tx');
var Web3 = require('../packages/web3');
var Basic = require('./sources/Basic');
var utils = require('./helpers/test.utils');
var util = require('util')

describe('transaction and message signing [ @E2E ]', function() {
    var web3;
    var accounts;
    var wallet;
    var Transaction = EJSTx.Transaction;
    var Common = EJSCommon.default;


    before(async function(){
        web3 = new Web3('http://localhost:8545');
        accounts = await web3.eth.getAccounts();

        // Create a funded account w/ a private key
        wallet = web3.eth.accounts.wallet.create(10);

        await web3.eth.sendTransaction({
            from: accounts[0],
            to: wallet[0].address,
            value: web3.utils.toWei('50', 'ether'),
        });
    })

    it('sendSignedTransaction (with ethereumjs-tx@2.x)', async function(){
        var destination = wallet[1].address;
        var source = wallet[0].address;
        var sourcePrivateKey = wallet[0].privateKey;

        var networkId = await web3.eth.net.getId();
        var chainId = await web3.eth.getChainId();

        var customCommon = Common.forCustomChain(
          'mainnet',
          {
            name: 'my-network',
            networkId: networkId,
            chainId: chainId,
          },
          'petersburg',
        );

        const txCount = await web3.eth.getTransactionCount(source);

        var rawTx = {
            nonce:    web3.utils.toHex(txCount),
            to:       destination,
            value:    web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gasLimit: web3.utils.toHex(21000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
        }

        var privateKey = Buffer.from(sourcePrivateKey.slice(2), 'hex');
        var tx = new Transaction(rawTx, {common: customCommon});

        tx.sign(privateKey);

        var serialized = '0x' + tx.serialize().toString('hex');
        var receipt = await web3.eth.sendSignedTransaction(serialized);

        assert(receipt.status === true);
    });

    it('sendSignedTransaction (with eth.signTransaction)', async function(){
        // ganache does not support eth_signTransaction
        if (process.env.GANACHE) return

        var destination = wallet[1].address;
        var source = accounts[0] // Unlocked geth-dev account

        const txCount = await web3.eth.getTransactionCount(source);

        var rawTx = {
            nonce:    web3.utils.toHex(txCount),
            to:       destination,
            from:     source,
            value:    web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gasLimit: web3.utils.toHex(21000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
        }

        var signed = await web3.eth.signTransaction(rawTx)
        var receipt = await web3.eth.sendSignedTransaction(signed.raw);

        assert(receipt.status === true);
    });

    it('sendSignedTransaction (with eth.accounts.signTransaction)', async function(){
        var source = wallet[0].address
        var destination = wallet[1].address;

        const txCount = await web3.eth.getTransactionCount(source);

        var txObject = {
            nonce:    web3.utils.toHex(txCount),
            to:       destination,
            value:    web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gasLimit: web3.utils.toHex(21000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
        }

        var signed = await web3.eth.accounts.signTransaction(txObject, wallet[0].privateKey);
        var receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);

        assert(receipt.status === true);
    });

    it('eth.personal.sign', async function(){
        // ganache does not support eth_sign
        if (process.env.GANACHE) return

        var message = 'hello';

        var signature = await web3.eth.personal.sign(
            message,
            accounts[1],            // Unlocked geth-dev acct
            "left-hand-of-darkness" // Default password at geth-dev
        );

        const recovered = await web3.eth.personal.ecRecover(message, signature);
        assert.equal(accounts[1].toLowerCase(), recovered.toLowerCase());
    });

    it('eth.accounts.sign', async function(){
      // ganache does not support eth_sign
        if (process.env.GANACHE) return

        var message = 'hello';

        var signed = web3.eth.accounts.sign(message, wallet[0].privateKey);
        const recovered = await web3.eth.personal.ecRecover(message, signed.signature);
        assert.equal(wallet[0].address.toLowerCase(), recovered.toLowerCase());
    })
});

