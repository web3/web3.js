var testMethod = require('./helpers/test.method.js');
var Eth = require('../packages/web3-eth');

var eth = new Eth();

var method = 'getBalance';

var tests = [{
    args: ['0x000000000000000000000000000000000000012d', 2],
    formattedArgs: ['0x000000000000000000000000000000000000012d', '0x2'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
},{
    args: ['0x000000000000000000000000000000000000012d', '0x1'],
    formattedArgs: ['0x000000000000000000000000000000000000012d', '0x1'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
}, {
    args: ['0x000000000000000000000000000000000000012d', 0x1],
    formattedArgs: ['0x000000000000000000000000000000000000012d', '0x1'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
}, {
    args: ['0x000000000000000000000000000000000000012d'],
    formattedArgs: ['0x000000000000000000000000000000000000012d', eth.defaultBlock],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
}, {
    args: ['0XDBDBDB2CBD23B783741E8D7FCF51E459B497E4A6', 0x1],
    formattedArgs: ['0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6', '0x1'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
}, {
    args: ['0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6', 0x1], // checksum address
    formattedArgs: ['0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6', '0x1'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
},
    {
    args: ['0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6', 0x1],
    formattedArgs: ['0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6', '0x1'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
}, {
    args: ['dbdbdb2cbd23b783741e8d7fcf51e459b497e4a6', 0x1],
    formattedArgs: ['0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6', '0x1'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
}, {
    args: ['0x000000000000000000000000000000000000012d', 0x1],
    formattedArgs: ['0x000000000000000000000000000000000000012d', '0x1'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
}, {
    args: ['0x000000000000000000000000000000000000012d'],
    formattedArgs: ['0x000000000000000000000000000000000000012d', 'latest'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
}, {
    args: ['000000000000000000000000000000000000012d'],
    formattedArgs: ['0x000000000000000000000000000000000000012d', 'latest'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
}, {
    args: ['XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS'], // iban address
    formattedArgs: ['0x00c5496aee77c1ba1f0854206a26dda82a81d6d8', 'latest'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
}];

testMethod.runTests('eth', method, tests);

