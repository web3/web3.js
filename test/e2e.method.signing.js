var assert = require('assert');
var Basic = require('./sources/Basic');
var utils = require('./helpers/test.utils');
var Web3 = utils.getWeb3();
var {TransactionFactory} = require('@ethereumjs/tx');

describe('transaction and message signing [ @E2E ]', function() {
    let web3;
    let accounts;
    let wallet;
    let basic;
    let instance;

    const basicOptions = {
        data: Basic.bytecode,
        gasPrice: 1000000000, // Default gasPrice set by Geth
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
            gasPrice: web3.utils.toHex('1000000000')
        };

        const signed = await web3.eth.signTransaction(rawTx);
        const receipt = await web3.eth.sendSignedTransaction(signed.raw);

        assert(receipt.status === true);
    });

    it('sendSignedTransaction (accounts.signTransaction with signing options)', async function(){
        // ganache does not support eth_signTransaction
        if (process.env.GANACHE || global.window ) return

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
        // ganache does not support eth_signTransaction
        if (process.env.GANACHE || global.window ) return

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

    it('accounts.signTransaction, (with callback, nonce not specified)', function(done){
        // ganache does not support eth_signTransaction
        if (process.env.GANACHE || global.window ) {
            done();
            return
        }

        const source = wallet[0].address;
        const destination = wallet[1].address;

        const txObject = {
            to:       destination,
            value:    web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gasLimit: web3.utils.toHex(21000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        };

        web3.eth.accounts.signTransaction(txObject, wallet[0].privateKey, async function(err, signed){
            const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            assert(receipt.status === true);
            done();
        });
    });

    it('accounts.signTransaction, (EIP-2930, accessList specified)', function(done){
        // ganache does not support eth_signTransaction
        if (process.env.GANACHE || global.window ) {
            done();
            return
        }

        const source = wallet[0].address;
        const destination = wallet[1].address;

        const txObject = {
            to:       destination,
            value:    web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gas: web3.utils.toHex(21000),
            accessList: []
        };

        web3.eth.accounts.signTransaction(txObject, wallet[0].privateKey, async function(err, signed){
            const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            assert(receipt.status === true);
            done();
        });
    });

    it('accounts.signTransaction, (EIP-2930, type 1 specified)', function(done){
        // ganache does not support eth_signTransaction
        if (process.env.GANACHE || global.window ) {
            done();
            return
        }

        const source = wallet[0].address;
        const destination = wallet[1].address;

        const txObject = {
            to:       destination,
            value:    web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gas: web3.utils.toHex(21000),
            type: 1
        };

        web3.eth.accounts.signTransaction(txObject, wallet[0].privateKey, async function(err, signed){
            const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            assert(receipt.status === true);
            done();
        });
    });

    it('accounts.signTransaction, (EIP-1559, maxFeePerGas and maxPriorityFeePerGas specified)', function(done){
        // ganache does not support eth_signTransaction
        if (process.env.GANACHE || global.window ) {
            done();
            return
        }

        const source = wallet[0].address;
        const destination = wallet[1].address;

        const txObject = {
            to:       destination,
            value:    web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gas: web3.utils.toHex(21000),
            maxFeePerGas: '0x59682F00', // 1.5 Gwei
            maxPriorityFeePerGas: '0x1DCD6500' // .5 Gwei
        };

        web3.eth.accounts.signTransaction(txObject, wallet[0].privateKey, async function(err, signed){
            const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            assert(receipt.status === true);
            done();
        });
    });

    it('accounts.signTransaction, (EIP-1559, type 2 specified)', function(done){
        // ganache does not support eth_signTransaction
        if (process.env.GANACHE || global.window ) {
            done();
            return
        }

        const source = wallet[0].address;
        const destination = wallet[1].address;

        const txObject = {
            to:       destination,
            value:    web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gas: web3.utils.toHex(21000),
            type: 2
        };

        web3.eth.accounts.signTransaction(txObject, wallet[0].privateKey, async function(err, signed){
            const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            assert(receipt.status === true);
            done();
        });
    });

    it('accounts.signTransaction, (EIP-1559, maxFeePerGas and accessList specified)', function(done){
        // ganache does not support eth_signTransaction
        if (process.env.GANACHE || global.window ) {
            done();
            return
        }

        const source = wallet[0].address;
        const destination = wallet[1].address;

        const txObject = {
            to:       destination,
            value:    web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gas: web3.utils.toHex(21000),
            maxFeePerGas: '0x59682F00', // 1.5 Gwei
            maxPriorityFeePerGas: '0x1DCD6500', // .5 Gwei
            accessList: []
        };

        web3.eth.accounts.signTransaction(txObject, wallet[0].privateKey, async function(err, signed){
            const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            assert(receipt.status === true);
            done();
        });
    });

    it('accounts.signTransaction errors when common, chain and hardfork all defined', async function(){
        // ganache does not support eth_signTransaction
        if (process.env.GANACHE || global.window ) return

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
            common: {
                customChain: {
                name: 'custom-network',
                networkId: 1,
                chainId: 1,
                }
            },
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
        // ganache does not support eth_signTransaction
        if (process.env.GANACHE || global.window ) return

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
        // ganache does not support eth_signTransaction
        if (process.env.GANACHE || global.window ) return

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
        // ganache does not support eth_signTransaction
        if (process.env.GANACHE || global.window ) return

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
            assert(err.message.includes('gasLimit is too low'));
        }
    })

    it('accounts.signTransaction errors when no transaction is passed', async function(){
        // ganache does not support eth_signTransaction
        if (process.env.GANACHE || global.window ) return

        try {
            await web3.eth.accounts.signTransaction(undefined, wallet[0].privateKey);
            assert.fail()
        } catch (err) {
            assert(err.message.includes('No transaction object'));
        }
    });

    it('wallet executes method call using chain & hardfork options', async function(){
        // Geth --dev errors with 'invalid sender' when using these options.
        // Requires a custom common configuration (see next test). Ganache doesn't care
        if(!process.env.GANACHE) return;

        basic = new web3.eth.Contract(Basic.abi, basicOptions);
        basic.defaultChain = 'mainnet';
        basic.defaultHardfork = 'istanbul';

        instance = await basic
            .deploy()
            .send({from: wallet[0].address});

        const receipt = await instance
            .methods
            .setValue('1')
            .send({from: wallet[0].address});

        assert(receipt.status === true);
        assert(web3.utils.isHexStrict(receipt.transactionHash));
    });

    it('wallet executes method call using customCommon option', async function(){
        const networkId = await web3.eth.net.getId();
        const chainId = await web3.eth.getChainId();

        const customCommon = {
            baseChain: 'mainnet',
            customChain: {
                name: 'custom-network',
                networkId: networkId,
                chainId: chainId,
            },
            harfork: 'istanbul',
        };

        basic = new web3.eth.Contract(Basic.abi, basicOptions);
        basic.defaultCommon = customCommon;

        instance = await basic
            .deploy()
            .send({from: wallet[0].address});

        const receipt = await instance
            .methods
            .setValue('1')
            .send({from: wallet[0].address});

        assert(receipt.status === true);
        assert(web3.utils.isHexStrict(receipt.transactionHash));
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
            gasPrice: 1000000000, // Default gasPrice set by Geth
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

    it('sendSignedTransaction reverts with reason', async function(){
        const data = instance
            .methods
            .reverts()
            .encodeABI();

        const source = wallet[0].address;
        const txCount = await web3.eth.getTransactionCount(source);

        const txObject = {
            nonce:    web3.utils.toHex(txCount),
            to:       instance.options.address,
            gasLimit: web3.utils.toHex(400000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            data: data
        };

        const signed = await web3.eth.accounts.signTransaction(txObject, wallet[0].privateKey);

        web3.eth.handleRevert = true;
        try {
            await web3.eth.sendSignedTransaction(signed.rawTransaction);
            assert.fail();
        } catch(err){
            assert.equal(err.receipt.status, false);
            assert.equal(err.reason, "REVERTED WITH REVERT");
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

    // Smoke test to validate browserify's buffer polyfills (feross/buffer@5)
    // A companion regression test for Webpack & feross/buffer@4.9.2 exists at:
    // test/eth.accounts.webpack.js
    it("encrypt then decrypt wallet", function(done) {
        this.timeout(20000);
        try {
            const password = "qwerty";
            const addressFromWallet = wallet[0].address;

            const keystore = wallet.encrypt(password);

            // Wallet created w/ 10 accounts in before block
            assert.equal(keystore.length, 10);

            wallet.decrypt(keystore, password);
            assert.equal(wallet.length, 10);

            const addressFromKeystore = wallet[0].address;
            assert.equal(addressFromKeystore, addressFromWallet);
            done()
        } catch(error) {
            done(error)
        }
    });

    it('accounts.signTransaction returning valid v r s values', async function(){

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
            hardfork: 'petersburg',
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
        
        const data = Buffer.from(signed.rawTransaction.slice(2), "hex")
        const tx = TransactionFactory.fromSerializedData(data);

        assert(signed.v === ('0x' + tx.v.toString('hex')));
        assert(signed.r === ('0x' + tx.r.toString('hex')));
        assert(signed.s === ('0x' + tx.s.toString('hex')));
    });
});