var testMethod = require('./helpers/test.method.js');

var method = 'getChainId';
var methodCall = 'eth_chainId';

var tests = [{
    result: '0x01',
    formattedResult: 1,
    call: methodCall
}];


testMethod.runTests('eth', method, tests);

