var assert = require('assert');
var EJSCommon = require('ethereumjs-common');
var EJSTx = require('ethereumjs-tx');
var Basic = require('./sources/Basic');
var utils = require('./helpers/test.utils');
var Web3 = utils.getWeb3();

describe('transaction and message signing [ @E2E ]', function() {
    let web3;
    let accounts;
    let wallet;
    let basic;
    let instance;

    const basicOptions = {
        data: Basic.bytecode,
        gasPrice: '1',
        gas: 4000000
    };

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

        basic = new web3.eth.Contract(Basic.abi, basicOptions);
        instance = await basic.deploy().send({from: accounts[0]});
    });

    it('sendSignedTransaction (with eth.signTransaction)', async function(){
        // ganache does not support eth_signTransaction
        if (process.env.GANACHE || global.window ) return

        const destination = wallet[1].address;
        const source = accounts[0]; // Unlocked geth-dev account

        const txCount = await web3.eth.getTransactionCount(source);

        const rawTx = {
            nonce:    web3.utils.toHex(txCount),
            to:       destination,
            from:     source,
            value:    web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gasLimit: web3.utils.toHex(21000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
        };

        const signed = await web3.eth.signTransaction(rawTx);
        const receipt = await web3.eth.sendSignedTransaction(signed.raw);

        assert(receipt.status === true);
    });

    it('sendSignedTransaction (accounts.signTransaction with signing options)', async function(){
        const source = wallet[0].address;
        const destination = wallet[1].address;

        const txCount = await web3.eth.getTransactionCount(source);
        const networkId = await web3.eth.net.getId();
        const chainId = await web3.eth.getChainId();

        const customCommon = {
            baseChain: 'mainnet',
            customChain: {
                name: 'custom-network',
                networkId: networkId,
                chainId: chainId,
            },
            harfork: 'petersburg',
        };

        const txObject = {
            nonce:    web3.utils.toHex(txCount),
            to:       destination,
            value:    web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gasLimit: web3.utils.toHex(21000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            common: customCommon
        };

        const signed = await web3.eth.accounts.signTransaction(txObject, wallet[0].privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);

        assert(receipt.status === true);
    });

    it('sendSignedTransaction (accounts.signTransaction / without signing options)', async function(){
        const source = wallet[0].address;
        const destination = wallet[1].address;

        const txCount = await web3.eth.getTransactionCount(source);

        const txObject = {
            nonce:    web3.utils.toHex(txCount),
            to:       destination,
            value:    web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gasLimit: web3.utils.toHex(21000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        };

        const signed = await web3.eth.accounts.signTransaction(txObject, wallet[0].privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);

        assert(receipt.status === true);
    });

    it('accounts.signTransaction, (nonce not specified)', async function(){
        const source = wallet[0].address;
        const destination = wallet[1].address;

        const txObject = {
            to:       destination,
            value:    web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gasLimit: web3.utils.toHex(21000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        };

        const signed = await web3.eth.accounts.signTransaction(txObject, wallet[0].privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);

        assert(receipt.status === true);
    });

    it('accounts.signTransaction, (nonce formatted as number)', async function(){
        const source = wallet[0].address;
        const destination = wallet[1].address;

        const txCount = await web3.eth.getTransactionCount(source);

        assert(typeof txCount === 'number');

        const txObject = {
            nonce:    txCount,
            to:       destination,
            value:    web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gasLimit: web3.utils.toHex(21000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        };

        const signed = await web3.eth.accounts.signTransaction(txObject, wallet[0].privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);

        assert(receipt.status === true);
    });

    it('accounts.signTransaction errors when common, chain and hardfork all defined', async function(){
        const source = wallet[0].address;
        const destination = wallet[1].address;

        const txCount = await web3.eth.getTransactionCount(source);

        const txObject = {
            nonce:    web3.utils.toHex(txCount),
            to:       destination,
            value:    web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gasLimit: web3.utils.toHex(21000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            chain: "ropsten",
            common: {},
            hardfork: "istanbul"
        };

        try {
            await web3.eth.accounts.signTransaction(txObject, wallet[0].privateKey);
            assert.fail()
        } catch (err) {
            assert(err.message.includes('common object or the chain and hardfork'));
        }
    });

    it('accounts.signTransaction errors when chain specified without hardfork', async function(){
        const source = wallet[0].address;
        const destination = wallet[1].address;

        const txCount = await web3.eth.getTransactionCount(source);

        const txObject = {
            nonce:    web3.utils.toHex(txCount),
            to:       destination,
            value:    web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gasLimit: web3.utils.toHex(21000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            chain: "ropsten"
        };

        try {
            await web3.eth.accounts.signTransaction(txObject, wallet[0].privateKey);
            assert.fail()
        } catch (err) {
            assert(err.message.includes('both values must be defined'));
        }
    });

    it('accounts.signTransaction errors when hardfork specified without chain', async function(){
        const source = wallet[0].address;
        const destination = wallet[1].address;

        const txCount = await web3.eth.getTransactionCount(source);

        const txObject = {
            nonce:    web3.utils.toHex(txCount),
            to:       destination,
            value:    web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gasLimit: web3.utils.toHex(21000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            hardfork: "istanbul"
        };

        try {
            await web3.eth.accounts.signTransaction(txObject, wallet[0].privateKey);
            assert.fail()
        } catch (err) {
            assert(err.message.includes('both values must be defined'));
        }
    });

    it('accounts.signTransaction errors when tx signing is invalid', async function(){
        const source = wallet[0].address;
        const destination = wallet[1].address;

        const txCount = await web3.eth.getTransactionCount(source);

        // Using gas === 0 / ethereumjs-tx checks this wrt common baseFee
        const txObject = {
            nonce:    web3.utils.toHex(txCount),
            to:       destination,
            value:    web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gasLimit: web3.utils.toHex(0),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            hardfork: "istanbul",
            chain:    "ropsten",
        };

        try {
            await web3.eth.accounts.signTransaction(txObject, wallet[0].privateKey);
            assert.fail()
        } catch (err) {
            assert(err.message.includes('gas limit is too low'));
        }
    })

    it('accounts.signTransaction errors when no transaction is passed', async function(){
        try {
            await web3.eth.accounts.signTransaction(undefined, wallet[0].privateKey);
            assert.fail()
        } catch (err) {
            assert(err.message.includes('No transaction object'));
        }
    });

    it('transactions sent with wallet throws error correctly (with receipt)', async function(){
        const data = instance
            .methods
            .reverts()
            .encodeABI();

        const tx = {
            from: wallet[0],
            to: instance.options.address,
            data: data,
            gasPrice: '1',
            gas: 4000000
        }

        try {
            await web3.eth.sendTransaction(tx);
            assert.fail();
        } catch(err){
            var receipt = utils.extractReceipt(err.message);

            assert(err.message.includes('revert'))
            assert(receipt.status === false);
        }
    });

    it('transactions sent with wallet error correctly (OOG)', function(done){
        const data = instance
            .methods
            .reverts()
            .encodeABI();

        const tx = {
            from: wallet[0],
            to: instance.options.address,
            data: data,
            gasPrice: '1',
            gas: 10
        }

        web3
            .eth
            .sendTransaction(tx)
            .on('error', function(err){
                assert(err.message.includes('gas'))
                done();
            })
    });

    it('eth.personal.sign', async function(){
        // ganache does not support eth_sign
        if (process.env.GANACHE || global.window ) return

        const message = 'hello';

        const signature = await web3.eth.personal.sign(
            message,
            accounts[1],            // Unlocked geth-dev acct
            "left-hand-of-darkness" // Default password at geth-dev
        );

        const recovered = await web3.eth.personal.ecRecover(message, signature);
        assert.equal(accounts[1].toLowerCase(), recovered.toLowerCase());
    });

    it('eth.accounts.sign', async function(){
        if (process.env.GANACHE || global.window ) return

        const message = 'hello';

        const signed = web3.eth.accounts.sign(message, wallet[0].privateKey);
        const recovered = await web3.eth.personal.ecRecover(message, signed.signature);
        assert.equal(wallet[0].address.toLowerCase(), recovered.toLowerCase());
    })
});

