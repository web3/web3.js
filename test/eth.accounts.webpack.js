var Accounts = require("./../packages/web3-eth-accounts");
var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../packages/web3');
var web3 = new Web3();

// These tests verify that Buffer usage in web3-eth-accounts is backwards
// compatible with a deprecated node Buffer substitute injected into
// builds by webpack (and React via webpack).
describe("accounts when using feross/buffer@4.9.2 (webpack v4)", function () {
    before(function(){
        original_Buffer = global.Buffer;
        global.Buffer = require('buffer/').Buffer;
    });

    after(function(){
        global.Buffer = original_Buffer;
    })

    it("encrypt then decrypt wallet", async function() {
        this.timeout(10000);

        const ethAccounts = new Accounts();
        const password = "qwerty";
        const wallet = ethAccounts.wallet.create(5);

        // Fix wallet race condition when calling `wallet.remove` immediately after `wallet.add`
        await new Promise(resolve => setImmediate(resolve));

        ethAccounts.wallet.remove(2);

        var keystore = ethAccounts.wallet.encrypt(password);
        ethAccounts.wallet.clear();

        ethAccounts.wallet.decrypt(keystore, password);
    });

    it('hashMessage', function() {
        const message = 'hello'
        const ethAccounts = new Accounts();
        const hashMessage = ethAccounts.hashMessage(message)
    });

    it("recoverTransaction", async function() {
        const common = {
            baseChain: 'mainnet',
            customChain: {
                name: 'custom-network',
                networkId: 1,
                chainId: 1,
            },
            harfork: 'petersburg',
        };
        const test = {
            address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
            iban: 'XE0556YCRTEZ9JALZBSCXOK4UJ5F3HN03DV',
            privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
            transaction: {
                chainId: 1,
                nonce: 0,
                gasPrice: "20000000000",
                gas: 21000,
                to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
                toIban: 'XE04S1IRT2PR8A8422TPBL9SR6U0HODDCUT',
                value: "1000000000",
                data: "",
                common: common
            },
            // signature from eth_signTransaction
            rawTransaction: "0xf868808504a817c80082520894f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008026a0afa02d193471bb974081585daabf8a751d4decbb519604ac7df612cc11e9226da04bf1bd55e82cebb2b09ed39bbffe35107ea611fa212c2d9a1f1ada4952077118",
            oldSignature: "0xf868808504a817c80082520894f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008026a0afa02d193471bb974081585daabf8a751d4decbb519604ac7df612cc11e9226da04bf1bd55e82cebb2b09ed39bbffe35107ea611fa212c2d9a1f1ada4952077118",
            transactionHash: "0xab0f71614c37231d71ae521ce188a9c7c9d5e976124a91f62f9f125348dd0326",
            messageHash: "0x2c7903a33b55caf582d170f21595f1a7e598df3fa61b103ea0cd9d6b2a92565d"
        };

        const ethAccounts = new Accounts();

        const testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
        assert.equal(testAccount.address, test.address);

        const tx = await testAccount.signTransaction(test.transaction);
        assert.equal(ethAccounts.recoverTransaction(tx.rawTransaction), test.address);
    });
});