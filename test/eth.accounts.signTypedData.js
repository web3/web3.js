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
                var ethAccounts = new Accounts();

                var data = ethAccounts.signTypedData(test.data, test.privateKey);

                assert.equal(data.signature, test.signature);
            });

            it("signTypedData - vsr", function() {
                var ethAccounts = new Accounts();

                var data = ethAccounts.signTypedData(test.data, test.privateKey);

                assert.deepEqual([ data.v, data.r, data.s], test.vsr);
            });

            it("recoverTypedData - string", function() {
                var ethAccounts = new Accounts();

                var address = ethAccounts.recoverTypedData(test.data, test.signature);

                assert.equal(address, test.address);
            });

            it("recoverTypedData - vsr", function() {
                var ethAccounts = new Accounts();

                var address = ethAccounts.recoverTypedData(test.data, test.vsr);

                assert.equal(address, test.address);
            });
        });
    });

    it('should add the "0x" prefix to the privateKey', function() {
        assert.equal(
            '0xc85ef7d79691fe79573b1a7064c19c1a9819ebdbd1faaab1a8ec92344438aaf4',
            new Accounts().privateKeyToAccount('c85ef7d79691fe79573b1a7064c19c1a9819ebdbd1faaab1a8ec92344438aaf4').privateKey
        );
    });

    it('should throw if a privateKey is given with a invalid length', function() {
        try {
            new Accounts().privateKeyToAccount('0000be6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728');
            assert.fail();
        } catch(err) {
            assert(err.message.includes('Private key must be 32 bytes long'));
        }
    });

    it('should throw if a privateKey is given with a invalid length', function() {
        try {
            new Accounts().sign('data', '00be6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728');
            assert.fail();
        } catch(err) {
            assert(err.message.includes('Private key must be 32 bytes long'));
        }
    });
});
