var Accounts = require("./../packages/web3-eth-accounts");
var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../packages/web3');
var web3 = new Web3();

var tests = [
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        data: 'Some data',
        // signature done with personal_sign
        signature: '0xa8037a6116c176a25e6fc224947fde9e79a2deaa0dd8b67b366fbdfdbffc01f953e41351267b20d4a89ebfe9c8f03c04de9b345add4a52f15bd026b63c8fb1501b'
    }, {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        data: 'Some data!%$$%&@*',
        // signature done with personal_sign
        signature: '0x05252412b097c5d080c994d1ea12abcee6f1cae23feb225517a0b691a66e12866b3f54292f9cfef98f390670b4d010fc4af7fcd46e41d72870602c117b14921c1c'
    }
];

describe("eth", function () {
    describe("accounts", function () {

        tests.forEach(function (test, i) {
            it("sign data using a string", function() {
                var ethAccounts = new Accounts();

                var data = ethAccounts.sign(test.data, test.privateKey);

                assert.equal(data.signature, test.signature);
            });

            it("sign data using a utf8 encoded hex string", function() {
                var ethAccounts = new Accounts();

                var data = ethAccounts.sign(web3.utils.utf8ToHex(test.data), test.privateKey);

                assert.equal(data.signature, test.signature);
            });


            it("recover signature using a string", function() {
                var ethAccounts = new Accounts();

                var address = ethAccounts.recover(test.data, test.signature);

                assert.equal(address, test.address);
            });

            it("recover signature using a hashed message", function() {
                var ethAccounts = new Accounts();

                var address = ethAccounts.recover(ethAccounts.hashMessage(test.data), test.signature);

                assert.equal(address, test.address);
            });

            it("recover signature (pre encoded) using a signature object", function() {
                var ethAccounts = new Accounts();

                var sig = ethAccounts.sign(web3.utils.utf8ToHex(test.data), test.privateKey);
                var address = ethAccounts.recover(sig);

                assert.equal(address, test.address);
            });

            it("recover signature using a signature object", function() {
                var ethAccounts = new Accounts();

                var sig = ethAccounts.sign(test.data, test.privateKey);
                var address = ethAccounts.recover(sig);

                assert.equal(address, test.address);
            });

            it("recover signature (pre encoded) using a hash and r s v values", function() {
                var ethAccounts = new Accounts();

                var sig = ethAccounts.sign(web3.utils.utf8ToHex(test.data), test.privateKey);
                var address = ethAccounts.recover(test.data, sig.v, sig.r, sig.s);

                assert.equal(address, test.address);
            });

            it("recover signature using a hash and r s v values", function() {
                var ethAccounts = new Accounts();

                var sig = ethAccounts.sign(test.data, test.privateKey);
                var address = ethAccounts.recover(test.data, sig.v, sig.r, sig.s);

                assert.equal(address, test.address);
            });
        });
    });
});
