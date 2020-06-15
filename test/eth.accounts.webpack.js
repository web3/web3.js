var Accounts = require("./../packages/web3-eth-accounts");
var Web3 = require('../packages/web3');
var web3 = new Web3();

// Regression test to verify that `Buffer` in web3-eth-accounts is backwards
// compatible with a deprecated node Buffer substitute injected into
// builds by webpack (and React).
describe("encrypt/decrypt wallet when using feross/buffer@4.9.2 (webpack v4)", function () {
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
        const keystore = ethAccounts.wallet.encrypt(password);
        ethAccounts.wallet.decrypt(keystore, password);
    });
});
