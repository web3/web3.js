var testMethod = require('./helpers/test.method.js');

var method = 'isMining';
var call = 'eth_mining';

var tests = [{
    result: true,
    formattedResult: true,
    call: call
}];


testMethod.runTests('eth', method, tests);
