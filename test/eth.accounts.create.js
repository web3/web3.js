var Accounts = require("./../packages/web3-eth-accounts");
var ethereumWallet = require('ethereumjs-wallet');
var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../packages/web3');
var web3 = new Web3();

var tests = [];
for (var i = 0; i < 1000; i++) {
    tests.push(i);
}


describe("eth", function () {
    describe("accounts", function () {

        tests.forEach(function (test, i) {
            it("create eth.account, and compare to ethereumjs-wallet", function() {
                var ethAccounts = new Accounts();

                // create account
                var acc = ethAccounts.create();

                // create ethereumjs-wallet account
                var ethWall = ethereumWallet.fromPrivateKey(Buffer.from(acc.privateKey.replace('0x',''),'hex'));

                // compare addresses
                assert.equal(acc.address, ethWall.getChecksumAddressString());
            });

        });
    });
});
