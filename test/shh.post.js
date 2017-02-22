var testMethod = require('./helpers/test.method.js');
var utils = require('../packages/web3-utils');

var method = 'post';

var tests = [{
    args: [{
        from: '0x123123123',
        topics: ['hello_world'],
        payload: utils.toHex('12345'),
        ttl: 100,
        workToProve: 101
    }],
    formattedArgs: [{
        from: '0x123123123',
        topics: [utils.fromUtf8('hello_world')],
        payload: utils.toHex('12345'),
        ttl: utils.toHex('100'),
        workToProve: utils.toHex('101')
    }],
    result: true,
    formattedResult: true,
    call: 'shh_'+ method
}, {
    args: [{
        from: '0x21312',
        topics: ['hello_world'],
        payload: '0x12345',
        ttl: 0x100,
        workToProve: 0x101
    }],
    formattedArgs: [{
        from: '0x21312',
        topics: [utils.fromUtf8('hello_world')],
        payload: '0x12345',
        ttl: '0x100',
        workToProve: '0x101'
    }],
    result: true,
    formattedResult: true,
    call: 'shh_'+ method
}];

testMethod.runTests('shh', method, tests);

