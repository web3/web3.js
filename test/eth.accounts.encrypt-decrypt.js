var Accounts = require("./../packages/web3-eth-accounts/src/index.js");
var ethers = require('ethers');
var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../packages/web3');
var web3 = new Web3();

var tests = [];
for (var i = 0; i < 50; i++) {
    tests.push(i);
}
var n = 256;
var r = 8;
var p = 1;
var salt = '3a1012583f8be138537bc7cf8a50c925b6fcc01a9f7744c85a18fbdc07999f10';
var iv = Buffer.from('653195c3e2791ac53f3f19b125c18f8c', 'hex');
var uuid = Buffer.from('ff31ddc3e2791ac53f3f19b125c18fff', 'hex');
var pw = 'test';

// tests from https://github.com/Gustav-Simonsson/go-ethereum/blob/7cc6b801e0967e5ebfa26b9f670675acea6e3a20/accounts/testdata/v3_test_vector.json
var staticTests = [
    {
        "json": {
            "crypto" : {
                "cipher" : "aes-128-ctr",
                "cipherparams" : {
                    "iv" : "83dbcc02d8ccb40e466191a123791e0e"
                },
                "ciphertext" : "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c",
                "kdf" : "scrypt",
                "kdfparams" : {
                    "dklen" : 32,
                    "n" : 262144,
                    "r" : 1,
                    "p" : 8,
                    "salt" : "ab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19"
                },
                "mac" : "2103ac29920d71da29f15d75b4a16dbe95cfd7ff8faea1056c33131d846e3097"
            },
            "id" : "3198bc9c-6672-5ab3-d995-4942343ae5b6",
            "version" : 3
        },
        "password": "testpassword",
        "priv": "7a28b5ba57c53603b0b07b56bba752f7784bf506fa95edc395f5cf6c7514fe9d"
    }, {
        "json": {
            "crypto" : {
                "cipher" : "aes-128-ctr",
                "cipherparams" : {
                    "iv" : "6087dab2f9fdbbfaddc31a909735c1e6"
                },
                "ciphertext" : "5318b4d5bcd28de64ee5559e671353e16f075ecae9f99c7a79a38af5f869aa46",
                "kdf" : "pbkdf2",
                "kdfparams" : {
                    "c" : 262144,
                    "dklen" : 32,
                    "prf" : "hmac-sha256",
                    "salt" : "ae3cd4e7013836a3df6bd7241b12db061dbe2c6785853cce422d148a624ce0bd"
                },
                "mac" : "517ead924a9d0dc3124507e3393d175ce3ff7c1e96529c6c555ce9e51205e9b2"
            },
            "id" : "3198bc9c-6672-5ab3-d995-4942343ae5b6",
            "version" : 3
        },
        "password": "testpassword",
        "priv": "7a28b5ba57c53603b0b07b56bba752f7784bf506fa95edc395f5cf6c7514fe9d"
    }, {
        "json": {
            "crypto" : {
                "cipher" : "aes-128-ctr",
                "cipherparams" : {
                    "iv" : "e0c41130a323adc1446fc82f724bca2f"
                },
                "ciphertext" : "9517cd5bdbe69076f9bf5057248c6c050141e970efa36ce53692d5d59a3984",
                "kdf" : "scrypt",
                "kdfparams" : {
                    "dklen" : 32,
                    "n" : 2,
                    "r" : 8,
                    "p" : 1,
                    "salt" : "711f816911c92d649fb4c84b047915679933555030b3552c1212609b38208c63"
                },
                "mac" : "d5e116151c6aa71470e67a7d42c9620c75c4d23229847dcc127794f0732b0db5"
            },
            "id" : "fecfc4ce-e956-48fd-953b-30f8b52ed66c",
            "version" : 3
        },
        "password": "foo",
        "priv": "fa7b3db73dc7dfdf8c5fbdb796d741e4488628c41fc4febd9160a866ba0f35"
    },{
        "json": {
            "crypto" : {
                "cipher" : "aes-128-ctr",
                "cipherparams" : {
                    "iv" : "3ca92af36ad7c2cd92454c59cea5ef00"
                },
                "ciphertext" : "108b7d34f3442fc26ab1ab90ca91476ba6bfa8c00975a49ef9051dc675aa",
                "kdf" : "scrypt",
                "kdfparams" : {
                    "dklen" : 32,
                    "n" : 2,
                    "r" : 8,
                    "p" : 1,
                    "salt" : "d0769e608fb86cda848065642a9c6fa046845c928175662b8e356c77f914cd3b"
                },
                "mac" : "75d0e6759f7b3cefa319c3be41680ab6beea7d8328653474bd06706d4cc67420"
            },
            "id" : "a37e1559-5955-450d-8075-7b8931b392b2",
            "version" : 3
        },
        "password": "foo",
        "priv": "81c29e8142bb6a81bef5a92bda7a8328a5c85bb2f9542e76f9b0f94fc018"
    }
];

describe("eth", function () {
    describe("accounts", function () {

        tests.forEach(function (test, i) {
            it("encrypt eth.account, and compare to ethers wallet", async () => {
                var ethAccounts = new Accounts();

                // create account
                var acc = ethAccounts.create();

                // create ethers wallet
                var ethWall = new ethers.Wallet(acc.privateKey);

                // compare addresses and private keys
                assert.equal(acc.address, ethWall.address);
                assert.equal(acc.privateKey, ethWall.privateKey);

                var encrypt = acc.encrypt(
                    pw,
                    {n: n, r: r, p: p,
                     salt: salt, iv: iv, uuid: uuid}
                );

                var ethWallEncrypt = JSON.parse((await ethWall.encrypt(
                    pw,
                    {scrypt: {N: n, r: r, p: p},
                     salt: '0x' + salt, iv: '0x' + iv.toString('hex'),
                     uuid: '0x' + uuid.toString('hex')}
                )).toLowerCase());

                assert.deepEqual(encrypt, ethWallEncrypt);
            });

            it("encrypt eth.account, and decrypt with ethers wallet", async () => {
                var ethAccounts = new Accounts();

                // create account
                var acc = ethAccounts.create();
                var encrypt = acc.encrypt(pw, {n: n});

                // create ethers wallet
                var ethWall = await ethers.Wallet.fromEncryptedJson(JSON.stringify(encrypt), pw);

                // compare addresses and private keys
                assert.equal(acc.address, ethWall.address);
                assert.equal(acc.privateKey, ethWall.privateKey);
            });

            it("encrypt ethers wallet, and decrypt with eth.account", async () => {
                var ethAccounts = new Accounts();

                // create ethers wallet
                var ethWall = ethers.Wallet.createRandom();
                var encrypt = await ethWall.encrypt(pw, {scrypt: {N: n}});

                // create account using encrypted json (nonStrict)
                var acc = ethAccounts.decrypt(encrypt, pw, true);

                // compare addresses and private keys
                assert.equal(acc.address, ethWall.address);
                assert.equal(acc.privateKey, ethWall.privateKey);
            });

            it("decrypt static signature using ethers wallet and eth.account and compare", async () => {
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
                var ethWall = await ethers.Wallet.fromEncryptedJson(JSON.stringify(encrypt), pw);

                // compare addresses
                assert.equal(acc.address, ethWall.address);
                assert.equal(web3.utils.toChecksumAddress('0x143f8913e0417997304fc179b531ff4cb9cab582'), acc.address);
                assert.equal(web3.utils.toChecksumAddress('0x143f8913e0417997304fc179b531ff4cb9cab582'), ethWall.address);
                assert.equal(ethers.utils.getAddress('0x143f8913e0417997304fc179b531ff4cb9cab582'), acc.address);
                assert.equal(ethers.utils.getAddress('0x143f8913e0417997304fc179b531ff4cb9cab582'), ethWall.address);

                // compare private keys
                assert.equal(acc.privateKey, ethWall.privateKey);
            });
        });

        staticTests.forEach(function (test, i) {
            it("decrypt staticTests and compare to private key", function() {
                // disable the test timeout
                this.timeout(0);

                var ethAccounts = new Accounts();

                // create account
                var acc = ethAccounts.decrypt(test.json, test.password);

                // compare addresses
                assert.equal(acc.privateKey, '0x'+ test.priv);
            });
        });
    });
});
