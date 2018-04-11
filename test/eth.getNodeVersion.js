var testMethod = require('./helpers/test.method.js');

var method = 'getNodeInfo';
var call = 'web3_clientVersion';

var tests = [{
    result: 'Geth/v1.6.7-stable-ab5646c5/darwin-amd64/go1.8.3',
    formattedResult: 'Geth/v1.6.7-stable-ab5646c5/darwin-amd64/go1.8.3',
    call: call
}];


testMethod.runTests('eth', method, tests);
