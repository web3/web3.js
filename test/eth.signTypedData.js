var testMethod = require('./helpers/test.method.js');
var Eth = require('../packages/web3-eth');

var eth = new Eth();

var method = 'signTypedData';

// test from: https://github.com/trufflesuite/ganache-core/blob/develop/test/requests.js#L411-L455
var typedData = {"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"Person":[{"name":"name","type":"string"},{"name":"wallet","type":"address"}],"Mail":[{"name":"from","type":"Person"},{"name":"to","type":"Person"},{"name":"contents","type":"string"}]},"primaryType":"Mail","domain":{"name":"Ether Mail","version":"1","chainId":1,"verifyingContract":"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"},"message":{"from":{"name":"Cow","wallet":"0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826"},"to":{"name":"Bob","wallet":"0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"},"contents":"Hello, Bob!"}}

var tests = [{
    // useLocalWallet: function (web3) {
    //     web3.eth.accounts.wallet.add('0xc85ef7d79691fe79573b1a7064c19c1a9819ebdbd1faaab1a8ec92344438aaf4');
    // },
    args: [typedData, '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'],
    formattedArgs: ['0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826', typedData],
    result: '0x4355c47d63924e8a72e509b65029052eb6c299d53a04e167c5775fd466751c9d07299936d304c153f6443dfa05f40ff007d72911b6f72307f996231605b915621c',
    formattedResult: {
       v: "0x1c",
       r: "0x4355c47d63924e8a72e509b65029052eb6c299d53a04e167c5775fd466751c9d",
       s: "0x07299936d304c153f6443dfa05f40ff007d72911b6f72307f996231605b91562",
       signature: "0x4355c47d63924e8a72e509b65029052eb6c299d53a04e167c5775fd466751c9d07299936d304c153f6443dfa05f40ff007d72911b6f72307f996231605b915621c"
    },
    call: 'eth_'+ method
}];

testMethod.runTests('eth', method, tests);
