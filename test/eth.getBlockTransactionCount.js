var testMethod = require('./helpers/test.method.js');

var method = 'getBlockTransactionCount';


var tests = [{
    args: ['0x4e65fda2159562a496f9f3522f8922f89122a3088497a122a3088497a'],
    formattedArgs: ['0x4e65fda2159562a496f9f3522f8922f89122a3088497a122a3088497a'],
    result: '0xb',
    formattedResult: 11,
    call: 'eth_getBlockTransactionCountByHash'
},{
    args: ['0x47D33b27Bb249a2DBab4C0612BF9CaF4C1950855'],
    formattedArgs: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855'],
    result: '0xb',
    formattedResult: 11,
    call: 'eth_getBlockTransactionCountByHash'
},{
    args: [436],
    formattedArgs: ['0x1b4'],
    result: '0xb',
    formattedResult: 11,
    call: 'eth_getBlockTransactionCountByNumber'
},{
    args: ['pending'],
    formattedArgs: ['pending'],
    result: '0xb',
    formattedResult: 11,
    call: 'eth_getBlockTransactionCountByNumber'
}];

testMethod.runTests('eth', method, tests);

