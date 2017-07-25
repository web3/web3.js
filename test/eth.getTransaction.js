var testMethod = require('./helpers/test.method.js');

var method = 'getTransaction';

var txResult = {
    "hash":"0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
    "nonce":"0x5",
    "blockHash": "0x6fd9e2a26ab",
    "blockNumber": "0x15df",
    "transactionIndex":  "0x1",
    "from":"0x407d73d8a49eeb85d32cf465507dd71d507100c1",
    "to":"0x85f43d8a49eeb85d32cf465507dd71d507100c1d",
    "value":"0x7f110",
    "gas": "0x7f110",
    "gasPrice":"0x09184e72a000",
    "input":"0x603880600c6000396000f30060"
};
var formattedTxResult = {
    "hash":"0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
    "nonce":5,
    "blockHash": "0x6fd9e2a26ab",
    "blockNumber": 5599,
    "transactionIndex":  1,
    "from":"0x407D73d8a49eeb85D32Cf465507dd71d507100c1", // checksum address
    "to":"0x85F43D8a49eeB85d32Cf465507DD71d507100C1d", // checksum address
    "value": '520464',
    "gas": 520464,
    "gasPrice": '10000000000000',
    "input":"0x603880600c6000396000f30060"
};

var tests = [{
    args: ['0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b'],
    formattedArgs: ['0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b'],
    result: txResult,
    formattedResult: formattedTxResult,
    call: 'eth_'+ method + 'ByHash'
}];

testMethod.runTests('eth', method, tests);

