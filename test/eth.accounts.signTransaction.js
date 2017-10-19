var FakeHttpProvider = require('./helpers/FakeIpcProvider');
var Web3 = require('../packages/web3');
var Accounts = require("./../packages/web3-eth-accounts");
var ethjsSigner = require("ethjs-signer");
var chai = require('chai');
var assert = chai.assert;

var clone = function (object) { return object ? JSON.parse(JSON.stringify(object)) : []; };

var tests = [
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        iban: 'XE25RG8S3H5TX5RD7QTL5UPVW90AHN2VYDC',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: 0,
            gasPrice: "20000000000",
            gas: 21000,
            to: '0x3535353535353535353535353535353535353535',
            toIban: 'XE4967QZMA14MI680T89KSPPJEJMU68MEYD', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: ""
        },
        // signature from eth_signTransaction
        rawTransaction: "0xf86c808504a817c800825208943535353535353535353535353535353535353535880de0b6b3a76400008025a04f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88da07e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0",
        oldSignature: "0xf86c808504a817c800825208943535353535353535353535353535353535353535880de0b6b3a7640000801ba0300e0d8f83ac82943e468164fa80236fdfcff21f978f66dd038b875cea6faa51a05a8e4b38b819491a0bb4e1f5fb4fd203b6a1df19e2adbec2ebdddcbfaca555f0"
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: 0,
            gasPrice: "230000000000",
            gas: 50000,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "0x0123abcd"
        },
        // web3.eth.signTransaction({from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0", gasPrice: "230000000000", gas: "50000", to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c', value: "1000000000000000000", data: "0x0123abcd"}).then(console.log);
        // signature from eth_signTransaction
        rawTransaction: "0xf8708085358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd26a031bb05bd1535150d312dcaa870a4a69c130a51aa80537659c1f308bf1f180ac6a012c938a8e04ac4e279d0b7c29811609031a96e949ad98f1ca74ca6078910bede",
        oldSignature: "0xf8708085358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd1ba081bba037015419ab5ce36e930b987da71b0ed5f0efb1849613223bf72399f598a05d2c1f109ad13f98a7693cfc35291e404ea8795755a176eb58a818de44f3756d"
    }
];

describe("eth", function () {
    describe("accounts", function () {

        // For each test
        tests.forEach(function (test, i) {
            it("signTransaction must compare to eth_signTransaction", function() {
                var ethAccounts = new Accounts();

                var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                assert.equal(testAccount.address, test.address);

                var tx = testAccount.signTransaction(test.transaction);

                assert.equal(tx.rawTransaction, test.rawTransaction);
            });
        });

        tests.forEach(function (test, i) {
            it("signTransaction using the iban as \"to\" must compare to eth_signTransaction", function() {
                var ethAccounts = new Accounts();

                var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                assert.equal(testAccount.address, test.address);

                var transaction = clone(test.transaction);
                transaction.to = transaction.toIban;
                delete transaction.toIban;
                var tx = testAccount.signTransaction(transaction);

                assert.equal(tx.rawTransaction, test.rawTransaction);
            });
        });

        tests.forEach(function (test, i) {
            it("signTransaction will call for nonce", function(done) {
                var provider = new FakeHttpProvider();
                var web3 = new Web3(provider);

                provider.injectResult('0xa');
                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, 'eth_getTransactionCount');
                    assert.deepEqual(payload.params, [test.address, "latest"]);
                });

                var ethAccounts = new Accounts(web3);

                var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                assert.equal(testAccount.address, test.address);

                var transaction = clone(test.transaction);
                delete transaction.nonce;
                testAccount.signTransaction(transaction)
                .then(function (tx) {
                    assert.isObject(tx);
                    assert.isString(tx.rawTransaction);

                    done();
                });
            });
        });
        tests.forEach(function (test, i) {
            it("signTransaction will call for gasPrice", function(done) {
                var provider = new FakeHttpProvider();
                var web3 = new Web3(provider);

                provider.injectResult('0x5022');
                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, 'eth_gasPrice');
                    assert.deepEqual(payload.params, []);
                });

                var ethAccounts = new Accounts(web3);

                var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                assert.equal(testAccount.address, test.address);

                var transaction = clone(test.transaction);
                delete transaction.gasPrice;
                testAccount.signTransaction(transaction)
                .then(function (tx) {
                    assert.isObject(tx);
                    assert.isString(tx.rawTransaction);

                    done();
                });
            });
        });
        tests.forEach(function (test, i) {
            it("signTransaction will call for chainId", function(done) {
                var provider = new FakeHttpProvider();
                var web3 = new Web3(provider);

                provider.injectResult(1);
                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, 'net_version');
                    assert.deepEqual(payload.params, []);
                });

                var ethAccounts = new Accounts(web3);

                var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                assert.equal(testAccount.address, test.address);

                var transaction = clone(test.transaction);
                delete transaction.chainId;
                testAccount.signTransaction(transaction)
                .then(function (tx) {
                    assert.isObject(tx);
                    assert.isString(tx.rawTransaction);

                    done();
                });
            });
        });
        tests.forEach(function (test, i) {
            it("signTransaction will call for nonce, gasPrice and chainId", function(done) {
                var provider = new FakeHttpProvider();
                var web3 = new Web3(provider);

                provider.injectResult(1);
                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, 'net_version');
                    assert.deepEqual(payload.params, []);
                });
                provider.injectResult(1);
                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, 'eth_gasPrice');
                    assert.deepEqual(payload.params, []);
                });
                provider.injectResult(1);
                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, 'eth_getTransactionCount');
                    assert.deepEqual(payload.params, [test.address, "latest"]);
                });

                var ethAccounts = new Accounts(web3);

                var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                assert.equal(testAccount.address, test.address);

                var transaction = clone(test.transaction);
                delete transaction.chainId;
                delete transaction.gasPrice;
                delete transaction.nonce;
                testAccount.signTransaction(transaction)
                .then(function (tx) {
                    assert.isObject(tx);
                    assert.isString(tx.rawTransaction);

                    done();
                });
            });
        });

        tests.forEach(function (test, i) {
            it("recoverTransaction, must recover signature", function() {
                var ethAccounts = new Accounts();

                var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                assert.equal(testAccount.address, test.address);

                var tx = testAccount.signTransaction(test.transaction);
                assert.equal(ethAccounts.recoverTransaction(tx.rawTransaction), test.address);
            });
        });

        tests.forEach(function (test, i) {
            it("recoverTransaction, must also recover old signature from eth-signer", function() {
                var ethAccounts = new Accounts();

                var oldSignature = ethjsSigner.sign(test.transaction, test.privateKey);

                assert.equal(ethAccounts.recoverTransaction(oldSignature), test.address);
            });
        });
    });
});
