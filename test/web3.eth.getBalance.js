var BigNumber = require('bignumber.js');
var web3 = require('../index');
var testMethod = require('./helpers/test.method.js');

var method = 'getBalance';

var tests = [{
    args: ['0x000000000000000000000000000000000000012d', 2],
    formattedArgs: ['0x000000000000000000000000000000000000012d', '0x2'],
    result: '0x31981',
    formattedResult: new BigNumber('0x31981', 16),
    call: 'eth_'+ method
},{
    args: ['0x000000000000000000000000000000000000012d', '0x1'],
    formattedArgs: ['0x000000000000000000000000000000000000012d', '0x1'],
    result: '0x31981',
    formattedResult: new BigNumber('0x31981', 16),
    call: 'eth_'+ method
}, {
    args: ['0x000000000000000000000000000000000000012d', 0x1],
    formattedArgs: ['0x000000000000000000000000000000000000012d', '0x1'],
    result: '0x31981',
    formattedResult: new BigNumber('0x31981', 16),
    call: 'eth_'+ method
}, {
    args: ['0x000000000000000000000000000000000000012d'],
    formattedArgs: ['0x000000000000000000000000000000000000012d', web3.eth.defaultBlock],
    result: '0x31981',
    formattedResult: new BigNumber('0x31981', 16),
    call: 'eth_'+ method
}, {
    args: ['0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6', 0x1],
    formattedArgs: ['0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6', '0x1'],
    result: '0x31981',
    formattedResult: new BigNumber('0x31981', 16),
    call: 'eth_'+ method
}, {
    args: ['dbdbdb2cbd23b783741e8d7fcf51e459b497e4a6', 0x1],
    formattedArgs: ['0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6', '0x1'],
    result: '0x31981',
    formattedResult: new BigNumber('0x31981', 16),
    call: 'eth_'+ method
}, {
    args: ['0x000000000000000000000000000000000000012d', 0x1],
    formattedArgs: ['0x000000000000000000000000000000000000012d', '0x1'],
    result: '0x31981',
    formattedResult: new BigNumber('0x31981', 16),
    call: 'eth_'+ method
}, {
    args: ['0x000000000000000000000000000000000000012d'],
    formattedArgs: ['0x000000000000000000000000000000000000012d', 'latest'],
    result: '0x31981',
    formattedResult: new BigNumber('0x31981', 16),
    call: 'eth_'+ method
}, {
    args: ['000000000000000000000000000000000000012d'],
    formattedArgs: ['0x000000000000000000000000000000000000012d', 'latest'],
    result: '0x31981',
    formattedResult: new BigNumber('0x31981', 16),
    call: 'eth_'+ method
}, {
    args: ['XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS'],
    formattedArgs: ['0x00c5496aee77c1ba1f0854206a26dda82a81d6d8', 'latest'],
    result: '0x31981',
    formattedResult: new BigNumber('0x31981', 16),
    call: 'eth_'+ method
}];

testMethod.runTests('eth', method, tests);

