var Accounts = require("./../packages/web3-eth-accounts");
var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../packages/web3');
var web3 = new Web3();

// test from: https://github.com/trufflesuite/ganache-core/blob/develop/test/requests.js#L411-L455
var tests = [
    {
        address: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
        privateKey: '0xc85ef7d79691fe79573b1a7064c19c1a9819ebdbd1faaab1a8ec92344438aaf4',
        data: {"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"Person":[{"name":"name","type":"string"},{"name":"wallet","type":"address"}],"Mail":[{"name":"from","type":"Person"},{"name":"to","type":"Person"},{"name":"contents","type":"string"}]},"primaryType":"Mail","domain":{"name":"Ether Mail","version":"1","chainId":1,"verifyingContract":"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"},"message":{"from":{"name":"Cow","wallet":"0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826"},"to":{"name":"Bob","wallet":"0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"},"contents":"Hello, Bob!"}},
        signature: '0x4355c47d63924e8a72e509b65029052eb6c299d53a04e167c5775fd466751c9d07299936d304c153f6443dfa05f40ff007d72911b6f72307f996231605b915621c',
        vsr: ["0x1c","0x4355c47d63924e8a72e509b65029052eb6c299d53a04e167c5775fd466751c9d","0x07299936d304c153f6443dfa05f40ff007d72911b6f72307f996231605b91562"]
    }
];


describe("eth", function () {
    describe("accounts", function () {
        tests.forEach(function (test, i) {
            it("signTypedData - string", function() {
                var data = new Accounts().signTypedData(test.data, test.privateKey);
                assert.equal(data.signature, test.signature);
            });

            it("signTypedData - vsr", function() {
                var data = new Accounts().signTypedData(test.data, test.privateKey);
                assert.deepEqual([ data.v, data.r, data.s], test.vsr);
            });

            it("recoverTypedData - string", function() {
                var address = new Accounts().recoverTypedData(test.data, test.signature);
                assert.equal(address, test.address);
            });

            it("recoverTypedData - vsr", function() {
                var address = new Accounts().recoverTypedData(test.data, test.vsr);
                assert.equal(address, test.address);
            });

            it("account.signTypedData - string", function() {
                var data = new Accounts().privateKeyToAccount(test.privateKey).signTypedData(test.data);
                assert.equal(data.signature, test.signature);
            });

            it("account.signTypedData - vsr", function() {
                var data = new Accounts().privateKeyToAccount(test.privateKey).signTypedData(test.data);
                assert.deepEqual([ data.v, data.r, data.s], test.vsr);
            });
        });
    });
});
