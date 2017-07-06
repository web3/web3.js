var Accounts = require("./../packages/web3-eth-accounts/src/index.js");
var ethjsSigner = require("ethjs-signer");
var assert = require('assert');

describe("eth", function () {
    describe("accounts", function () {
        var accounts = [
            {
                "address": '0x9d8A62f656a8d1615C1294fd71e9CFb3E4855A4F',
                "publicKey": '0x4bc2a31265153f07e70e0bab08724e6b85e217f8cd628ceb62974247bb493382ce28cab79ad7119ee1ad3ebcdb98a16805211530ecc6cfefa1b88e6dff99232a',
                "privateKey": '0x4646464646464646464646464646464646464646464646464646464646464646',
                "transactions": [
                    {
                        "object": {
                            "chainId": 3,
                            "nonce": 9,
                            "gasPrice": "20000000000",
                            "gasLimit": "21000",
                            "to": '0x3535353535353535353535353535353535353535',
                            "value": "1000000000000000000",
                            "data": ""
                        },
                        "signature": "0xf86c098504a817c800825208943535353535353535353535353535353535353535880de0b6b3a76400008025a028ef61340bd939bc2195fe537567866003e1a15d3c71ff63e1590620aa636276a067cbe9d8997f761aecb703304b3800ccf555c9f3dc64214b297fb1966a3b6d83"
                    }
                ]
            },
            {
                "address": '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
                "publicKey": '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559',
                "privateKey": '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
                "transactions": [
                    {
                        "object": {
                            "chainId": 3,
                            "nonce": 0,
                            "gasPrice": "230000000000",
                            "gasLimit": "21000",
                            "to": '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
                            "value": "1000000000000000000",
                            "data": "0x0123abcd"
                        },
                        "signature": "0xf8708085358d117c0082520894fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd25a032dbcf46a64b9892df24d8b961d2a52fd66b1dabd3a0d96940fd6795c01d8711a01b86df9475de7451554557d87b69456e3fa95aa5375584bf63d1ffd647a225d9",
                        "oldSignature": "0xf8708085358d117c0082520894fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd1ba04e289b471dd4469d5080ce3726b8359d5b0c649e012bbbdde53f9b6580ad21a2a0333663ea96846c112f3878705c8c24a763d1fbf8f97c174d26e350c7ef0d7263"
                    }
                ]
            }
        ];

        // For each account
        accounts.forEach(function (correctAccount, i) {
            it("creation and signature algorithms must match expected values (account " + i + ")", function() {
                var ethAccounts = new Accounts();

                // Generates an address from this account's private key
                var testAccount = ethAccounts.privateToAccount(correctAccount.privateKey);

                // Generated address must match
                assert(testAccount.address === correctAccount.address);

                // For each transaction on this account
                correctAccount.transactions.forEach(function (transaction) {

                    // Signs it, uing post-EIP 155 scheme
                    var signature = ethAccounts.signTransaction(
                      transaction.object,
                      correctAccount.privateKey);

                    // Checks if the signature is as expected
                    assert(transaction.signature === signature);

                    // Checks if we can recover the right address
                    var recoveredAddress = ethAccounts.recoverTransaction(signature);
                    assert(recoveredAddress === testAccount.address);

                    // If the test also provides a pre-EIP 155 signature
                    if (transaction.oldSignature) {

                        // Signs it, using pre-EIP 155 scheme (using the ethjs-signer lib)
                        var oldSignature = ethjsSigner.sign(
                          transaction.object,
                          correctAccount.privateKey);

                        // Checks if the signature is as expected
                        assert(transaction.oldSignature === oldSignature);

                        // Checks if we can recover the right address from old sigs (using web3)
                        var recoveredAddress = ethAccounts.recoverTransaction(oldSignature);
                        assert(recoveredAddress === testAccount.address);
                    }
                });
            });
        });
    });
});
