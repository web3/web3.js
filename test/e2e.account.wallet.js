var assert = require('assert');
var utils = require('./helpers/test.utils');
var Web3 = utils.getWeb3();

describe('decrypt keystore [ @E2E ]', function () {
    var web3;
    var keystore = {
        "json": [
        {
            "version": 3,
            "id": "cd3f55c7-b84d-4708-956a-23725971c7e3",
            "address": "cc9967fa5b8185354492da1ac2d40da092366a8f",
            "crypto": {
            "ciphertext": "6c8b5a914daaa840ae4589fdc970946bd588f339e3c7d947fc074ad0bf2cc06f",
            "cipherparams": {
                "iv": "7403a6cb6d5685d92e536efd324d40f2"
            },
            "cipher": "aes-128-ctr",
            "kdf": "scrypt",
            "kdfparams": {
                "dklen": 32,
                "salt": "68b700715a3e4fe85c5aae7b62094cf2856b2f4b5546f0c2b0e7f1124f7c7162",
                "n": 8192,
                "r": 8,
                "p": 1
            },
            "mac": "d89c36cbe31f3046688fc3b97f77129edd6766b57b2f49457a1ff445c54bdd7f"
            }
        }
        ],
        "password": "test",
        "priv": "0xce8347345071827fdf34ad9eb87fd10e857cd965738e5e4965319172bf051694"
    }

    before(function () {
        web3 = new Web3('http://localhost:8545');
    })

    it('decrypts a password protected keystore file correctly', async function () {
        var res = web3.eth.accounts.wallet.decrypt(keystore.json, keystore.password);
        assert.equal(keystore.priv, res[0].privateKey);

    });
});
