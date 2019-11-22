var testMethod = require('./helpers/test.method.js');

var method = 'getBlockNumber';

var tests = [{
    result: '0xb',
    formattedResult: '11',
    call: 'eth_blockNumber'
}];


testMethod.runTests('eth', method, tests);
