var Accounts = require("./../packages/web3-eth-accounts");
var ethers = require('ethers');
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
            it("create eth.account, and compare to ethers wallet", function() {
                var ethAccounts = new Accounts();

                // create account
                var acc = ethAccounts.create();

                // create ethers wallet
                var ethWall = new ethers.Wallet(acc.privateKey);

                // compare addresses and private keys
                assert.equal(acc.address, ethWall.address);
                assert.equal(acc.privateKey, ethWall.privateKey);
            });

        });
    });
});
