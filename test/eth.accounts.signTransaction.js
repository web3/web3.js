var Accounts = require("./../packages/web3-eth-accounts/src/index.js");
var ethjsSigner = require("ethjs-signer");
var chai = require('chai');
var assert = chai.assert;

var tests = [
    {
        "address": '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        "privateKey": '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        "transaction": {
            "chainId": 1,
            "nonce": 0,
            "gasPrice": "20000000000",
            "gas": 21000,
            "to": '0x3535353535353535353535353535353535353535',
            "value": "1000000000000000000",
            "data": ""
        },
        // signature from eth_signTransaction
        "rawTransaction": "0xf86c808504a817c800825208943535353535353535353535353535353535353535880de0b6b3a76400008025a04f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88da07e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0"
    },
    {
        "address": '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
        "publicKey": '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559',
        "privateKey": '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        "transaction": {
            "chainId": 1,
            "nonce": 0,
            "gasPrice": "230000000000",
            "gas": 50000,
            "to": '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            "value": "1000000000000000000",
            "data": "0x0123abcd"
        },
        // web3.eth.signTransaction({from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0", gasPrice: "230000000000", gas: "50000", to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c', value: "1000000000000000000", data: "0x0123abcd"}).then(console.log);
        // signature from eth_signTransaction
        "rawTransaction": "0xf8708085358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd26a031bb05bd1535150d312dcaa870a4a69c130a51aa80537659c1f308bf1f180ac6a012c938a8e04ac4e279d0b7c29811609031a96e949ad98f1ca74ca6078910bede",
        // "oldSignature": "0xf8708085358d117c0082520894fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd1ba04e289b471dd4469d5080ce3726b8359d5b0c649e012bbbdde53f9b6580ad21a2a0333663ea96846c112f3878705c8c24a763d1fbf8f97c174d26e350c7ef0d7263"
    }
];

describe("eth", function () {
    describe("accounts", function () {

        // For each test
        tests.forEach(function (test, i) {
            it("signTransaction must compare to eth-signer", function() {
                var ethAccounts = new Accounts();

                var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                assert.equal(testAccount.address, test.address);


                var tx = testAccount.signTransaction(test.transaction);


                console.log(tx);
                assert.equal(tx.rawTransaction, test.rawTransaction);
            });
        });

    // OLD
        function test() {
            var ethAccounts = new Accounts();

            // Generates an address from this account's private key
            var testAccount = ethAccounts.privateKeyToAccount(correctAccount.privateKey);

            // Generated address must match
            assert.equal(testAccount.address, correctAccount.address);

            // For each transaction on this account
            correctAccount.transactions.forEach(function (transaction) {

                // Signs it, uing post-EIP 155 scheme
                var signature = ethAccounts.signTransaction(
                    transaction.object,
                    correctAccount.privateKey);

                // Checks if the signature is as expected
                assert.equal(transaction.signature, signature.rawTransaction);

                // Checks if we can recover the right address
                var recoveredAddress = ethAccounts.recoverTransaction(signature);
                assert.equal(recoveredAddress, testAccount.address);

                // If the test also provides a pre-EIP 155 signature
                if (transaction.oldSignature) {

                    // Signs it, using pre-EIP 155 scheme (using the ethjs-signer lib)
                    var oldSignature = ethjsSigner.sign(
                        transaction.object,
                        correctAccount.privateKey);

                    // Checks if the signature is as expected
                    assert.equal(transaction.oldSignature, oldSignature);

                    // Checks if we can recover the right address from old sigs (using web3)
                    var recoveredAddress = ethAccounts.recoverTransaction(oldSignature);
                    assert.equal(recoveredAddress, testAccount.address);
                }
            });
        }
    });
});
