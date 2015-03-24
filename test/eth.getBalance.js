var BigNumber = require('bignumber.js');
var web3 = require('../index');
var testMethod = require('./helpers/test.method.js');

var method = 'getBalance';

var tests = [{
    args: [301, 2],
    formattedArgs: ['0x12d', '0x2'],
    result: '0x31981',
    formattedResult: new BigNumber('0x31981', 16),
    call: 'eth_'+ method
},{
    args: ['0x12d', '0x1'],
    formattedArgs: ['0x12d', '0x1'],
    result: '0x31981',
    formattedResult: new BigNumber('0x31981', 16),
    call: 'eth_'+ method
}, {
    args: [0x12d, 0x1],
    formattedArgs: ['0x12d', '0x1'],
    result: '0x31981',
    formattedResult: new BigNumber('0x31981', 16),
    call: 'eth_'+ method
}, {
    args: [0x12d],
    formattedArgs: ['0x12d', web3.eth.defaultBlock],
    result: '0x31981',
    formattedResult: new BigNumber('0x31981', 16),
    call: 'eth_'+ method
}];

testMethod.runTests(method, tests);

