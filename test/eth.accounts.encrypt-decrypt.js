var Accounts = require("./../packages/web3-eth-accounts/src/index.js");
var ethereumWallet = require('ethereumjs-wallet');
var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../src/index.js');
var web3 = new Web3();

var tests = [];
for (var i = 0; i < 50; i++) {
    tests.push(i);
}
var n = 256;
var salt = '3a1012583f8be138537bc7cf8a50c925b6fcc01a9f7744c85a18fbdc07999f10';
var iv = new Buffer('653195c3e2791ac53f3f19b125c18f8c', 'hex');
var uuid = new Buffer('ff31ddc3e2791ac53f3f19b125c18fff', 'hex');
var pw = 'test';


describe("eth", function () {
    describe("accounts", function () {

        tests.forEach(function (test, i) {
            it("encrypt eth.account, and compare to ethereumjs-wallet", function() {
                var ethAccounts = new Accounts();

                // create account
                var acc = ethAccounts.create();

                // create ethereumjs-wallet account
                var ethWall = ethereumWallet.fromPrivateKey(new Buffer(acc.privateKey.replace('0x',''),'hex'));

                // compare addresses
                assert.equal(acc.address, ethWall.getChecksumAddressString());

                assert.deepEqual(acc.encrypt(pw, {n: n,salt: salt, iv: iv, uuid: uuid}), ethWall.toV3(pw, {n: n, salt: salt, iv: iv, uuid: uuid}));
            });

            it("encrypt eth.account, and decrypt with ethereumjs-wallet", function() {
                var ethAccounts = new Accounts();

                // create account
                var acc = ethAccounts.create();
                var encrypt = acc.encrypt(pw, {n: n});

                // create ethereumjs-wallet account
                var ethWall = ethereumWallet.fromV3(encrypt, pw);

                // compare addresses
                assert.equal(acc.address, ethWall.getChecksumAddressString());

            });

            it("encrypt ethereumjs-wallet, and decrypt with eth.account", function() {
                var ethAccounts = new Accounts();

                // create account
                var ethWall = ethereumWallet.generate();
                var encrypt = ethWall.toV3(pw, {n: n});

                // create ethereumjs-wallet account
                var acc = ethAccounts.decrypt(encrypt, pw);

                // compare addresses
                assert.equal(acc.address, ethWall.getChecksumAddressString());

            });

            it("decrypt static signature using ethereumjs-wallet and eth.account and compare", function() {
                var ethAccounts = new Accounts();

                var encrypt = { version: 3,
                    id: '6dac4ae5-7604-498e-a2a2-e86cfb289d0c',
                    address: '143f8913e0417997304fc179b531ff4cb9cab582',
                    crypto:
                        { ciphertext: '8b20d7797fee1c36ec2fff176e1778170745794ad2f124862f7f4bfc028daa27',
                            cipherparams: { iv: 'c6170befc885c940e0d0553f3ba01c6a' },
                            cipher: 'aes-128-ctr',
                            kdf: 'scrypt',
                            kdfparams:
                                { dklen: 32,
                                    salt: 'd78584e30aaf56781b4432116b1de9b1560b3ca6f4624624c14fb6e6d5638a48',
                                    n: 256,
                                    r: 8,
                                    p: 1 },
                            mac: '23d4497c779a6bc421f5cc54358309228389597f594448c5c900ad747f97401b' } };

                var acc = ethAccounts.decrypt(encrypt, pw);
                var ethWall = ethereumWallet.fromV3(encrypt, 'test');

                // compare addresses
                assert.equal(acc.address, ethWall.getChecksumAddressString());
                assert.equal(web3.utils.toChecksumAddress('0x143f8913e0417997304fc179b531ff4cb9cab582'), acc.address);
            });

        });
    });
});
